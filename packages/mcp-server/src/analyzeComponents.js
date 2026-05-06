const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const componentRoot = path.join(workspaceRoot, 'packages/nimbus-ui/src');
const storyRoot = path.join(workspaceRoot, 'packages/docs/stories');

const ignoredDirs = new Set(['theme']);

function getComponents() {
  return fs
    .readdirSync(componentRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !ignoredDirs.has(entry.name))
    .map(entry => entry.name)
    .sort();
}

function exists(...segments) {
  return fs.existsSync(path.join(...segments));
}

function readIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

function pascalCase(value) {
  return value
    .split('-')
    .map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join('');
}

function extractProps(componentDir) {
  const interfaceFile = path.join(componentDir, 'interface.ts');
  const indexFile = path.join(componentDir, 'index.tsx');
  const source = `${readIfExists(interfaceFile)}\n${readIfExists(indexFile)}`;
  const props = [];
  let collecting = false;

  for (const line of source.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (/^(export\s+)?interface\s+\w*Props\b/.test(trimmed)) {
      if (trimmed.includes('{}') || (trimmed.includes('{') && trimmed.includes('}'))) {
        collecting = false;
        continue;
      }
      collecting = true;
      continue;
    }

    if (collecting && trimmed.startsWith('}')) {
      collecting = false;
      continue;
    }

    if (!collecting || !trimmed || trimmed.startsWith('*') || trimmed.startsWith('/')) continue;

    const propMatch = trimmed.match(/^([A-Za-z_$][\w$]*)(\?)?:\s*([^;]+);?/);
    if (!propMatch) continue;

    props.push({
      name: propMatch[1],
      required: propMatch[2] !== '?',
      type: propMatch[3].trim(),
    });
  }

  return dedupeByName(props);
}

function dedupeByName(items) {
  const seen = new Set();
  return items.filter(item => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}

function extractDefaultProps(componentDir) {
  const source = readIfExists(path.join(componentDir, 'index.tsx'));
  const defaults = {};
  const matches = source.matchAll(/([A-Za-z_$][\w$]*)\s*=\s*('[^']*'|"[^"]*"|true|false|null|undefined|\d+)/g);

  for (const match of matches) {
    defaults[match[1]] = match[2];
  }

  return defaults;
}

function analyzeNaming(props) {
  const issues = [];

  for (const prop of props) {
    if (/^on[a-z]/.test(prop.name)) {
      issues.push({
        level: 'warn',
        prop: prop.name,
        message: 'Event callback should use onXxx camel case.',
      });
    }

    if (['visible'].includes(prop.name)) {
      issues.push({
        level: 'warn',
        prop: prop.name,
        message: 'Overlay components should prefer open instead of visible.',
      });
    }

    if (['modelValue'].includes(prop.name)) {
      issues.push({
        level: 'warn',
        prop: prop.name,
        message: 'React components should prefer value/defaultValue instead of modelValue.',
      });
    }
  }

  return issues;
}

function scoreComponent(files, props, namingIssues) {
  let score = 0;
  const details = [];

  addScore(files.hasIndex, 15, 'component entry', details);
  addScore(files.hasTypes, 15, 'props type definition', details);
  addScore(files.hasStyle, 10, 'style file', details);
  addScore(files.hasTest, 15, 'unit test', details);
  addScore(files.hasStory, 15, 'Storybook story', details);
  addScore(files.hasDemo, 10, 'demo file', details);
  addScore(files.hasDoc, 10, 'component markdown doc', details);
  addScore(props.length > 0, 10, 'extractable props schema', details);

  score = details.reduce((sum, item) => sum + item.score, 0);
  score -= Math.min(namingIssues.length * 5, 20);

  return {
    score: Math.max(score, 0),
    details,
  };
}

function addScore(pass, value, label, details) {
  details.push({
    label,
    pass,
    score: pass ? value : 0,
  });
}

function analyzeComponent(component) {
  const componentDir = path.join(componentRoot, component);
  const displayName = pascalCase(component);
  const files = {
    hasIndex: exists(componentDir, 'index.tsx') || exists(componentDir, 'index.ts'),
    hasTypes: exists(componentDir, 'interface.ts') || component === 'alert',
    hasStyle: exists(componentDir, 'style/index.less'),
    hasTest: exists(componentDir, '__tests__/index.test.tsx'),
    hasStory: exists(storyRoot, `${displayName}.stories.tsx`),
    hasDemo: exists(componentDir, 'demo/basic.tsx'),
    hasDoc: exists(componentDir, 'index.md'),
  };
  const props = extractProps(componentDir);
  const defaults = extractDefaultProps(componentDir);
  const events = props.filter(prop => /^on[A-Z]/.test(prop.name)).map(prop => prop.name);
  const namingIssues = analyzeNaming(props);
  const quality = scoreComponent(files, props, namingIssues);

  return {
    component,
    displayName,
    category: inferCategory(component),
    files,
    props: props.map(prop => ({
      ...prop,
      defaultValue: defaults[prop.name],
    })),
    events,
    namingIssues,
    quality,
  };
}

function inferCategory(component) {
  if (['button'].includes(component)) return 'General';
  if (['input', 'select', 'upload'].includes(component)) return 'Data Entry';
  if (['table'].includes(component)) return 'Data Display';
  if (['alert', 'modal'].includes(component)) return 'Feedback';
  return 'Other';
}

function createReport() {
  const components = getComponents().map(analyzeComponent);
  const averageScore = Math.round(
    components.reduce((sum, item) => sum + item.quality.score, 0) / Math.max(components.length, 1),
  );

  return {
    target: 'packages/nimbus-ui/src/*',
    generatedAt: new Date().toISOString(),
    summary: {
      components: components.length,
      averageScore,
      missingStories: components.filter(item => !item.files.hasStory).map(item => item.component),
      missingTests: components.filter(item => !item.files.hasTest).map(item => item.component),
      namingIssues: components.reduce((sum, item) => sum + item.namingIssues.length, 0),
    },
    components,
  };
}

function printReport(report) {
  console.log('Nimbus UI Component Governance Report');
  console.log('=====================================');
  console.log(`Target: ${report.target}`);
  console.log(`Summary: ${report.summary.components} components, average score ${report.summary.averageScore}`);
  console.log('');

  for (const component of report.components) {
    console.log(`${component.displayName} (${component.category}) - score ${component.quality.score}`);
    console.log(
      `  files: story=${status(component.files.hasStory)}, test=${status(component.files.hasTest)}, style=${status(
        component.files.hasStyle,
      )}, doc=${status(component.files.hasDoc)}`,
    );
    console.log(`  props: ${component.props.map(prop => prop.name).join(', ') || 'none detected'}`);
    console.log(`  events: ${component.events.join(', ') || 'none detected'}`);

    if (component.namingIssues.length) {
      for (const issue of component.namingIssues) {
        console.log(`  ${issue.level}: ${issue.prop} - ${issue.message}`);
      }
    }
    console.log('');
  }
}

function status(pass) {
  return pass ? 'ok' : 'missing';
}

function runCli() {
  const report = createReport();
  const outputIndex = process.argv.indexOf('--output');
  const outputPath = outputIndex === -1 ? null : process.argv[outputIndex + 1];
  const serialized = JSON.stringify(report, null, 2);

  if (outputPath) {
    fs.writeFileSync(path.resolve(process.cwd(), outputPath), `${serialized}\n`);
  }

  if (process.argv.includes('--json')) {
    console.log(serialized);
  } else {
    printReport(report);
  }

  if (process.argv.includes('--fail-on-missing') && (report.summary.missingStories.length || report.summary.missingTests.length)) {
    process.exitCode = 1;
  }

  if (process.argv.includes('--fail-on-naming') && report.summary.namingIssues > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  createReport,
};
