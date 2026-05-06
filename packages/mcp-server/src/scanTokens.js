const fs = require('fs');
const path = require('path');

const workspaceRoot = path.resolve(__dirname, '../../..');
const componentRoot = path.join(workspaceRoot, 'packages/nimbus-ui/src');
const registryPath = path.join(workspaceRoot, 'packages/tokens/token.registry.json');

const COLOR_PATTERN = /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\([^)]+\)|rgb\([^)]+\)|rgb\([^)]+\s\/\s[^)]+\)/g;

function normalizeHex(value) {
  const lower = value.toLowerCase();

  if (!lower.startsWith('#')) return lower.replace(/\s+/g, ' ');
  if (lower.length !== 4) return lower;

  return `#${lower[1]}${lower[1]}${lower[2]}${lower[2]}${lower[3]}${lower[3]}`;
}

function loadRegistry() {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const byValue = new Map();

  for (const token of registry.color || []) {
    const values = [token.value, ...(token.aliases || [])].map(normalizeHex);
    for (const value of values) {
      const current = byValue.get(value) || [];
      current.push(token);
      byValue.set(value, current);
    }
  }

  return { registry, byValue };
}

function chooseToken(value, property, tokenMap) {
  const candidates = tokenMap.get(value) || [];
  if (candidates.length <= 1) return candidates[0] || null;

  if (property.includes('border')) return findToken(candidates, 'border') || candidates[0];
  if (property.includes('shadow')) return findToken(candidates, 'shadow') || candidates[0];
  if (property === 'color') return findToken(candidates, 'text') || candidates[0];
  if (property.includes('background')) {
    return findToken(candidates, 'bg') || findToken(candidates, 'overlay') || findToken(candidates, 'mask') || candidates[0];
  }

  return candidates[0];
}

function findToken(tokens, keyword) {
  return tokens.find(token => token.name.includes(keyword));
}

function getStyleFiles() {
  return fs
    .readdirSync(componentRoot, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(componentRoot, entry.name, 'style/index.less'))
    .filter(file => fs.existsSync(file));
}

function analyzeFile(file, tokenMap) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  const findings = [];

  lines.forEach((line, index) => {
    const matches = line.match(COLOR_PATTERN);
    if (!matches) return;

    for (const raw of matches) {
      const value = normalizeHex(raw);
      const property = getCssProperty(line);
      const token = chooseToken(value, property, tokenMap);
      findings.push({
        line: index + 1,
        value: raw,
        property,
        token: token
          ? {
              name: token.name,
              lessVariable: token.lessVariable,
              cssVariable: token.cssVariable,
            }
          : null,
      });
    }
  });

  return findings;
}

function getCssProperty(line) {
  const match = line.match(/^\s*([\w-]+)\s*:/);
  return match ? match[1] : 'unknown';
}

function createReport() {
  const { byValue } = loadRegistry();
  const files = getStyleFiles();
  const components = files.map(file => {
    const component = path.basename(path.dirname(path.dirname(file)));
    const findings = analyzeFile(file, byValue);

    return {
      component,
      file: path.relative(workspaceRoot, file).replace(/\\/g, '/'),
      findings,
      summary: {
        total: findings.length,
        mapped: findings.filter(item => item.token).length,
        unmapped: findings.filter(item => !item.token).length,
      },
    };
  });

  const total = components.reduce((sum, item) => sum + item.summary.total, 0);
  const mapped = components.reduce((sum, item) => sum + item.summary.mapped, 0);
  const unmapped = components.reduce((sum, item) => sum + item.summary.unmapped, 0);

  return {
    target: 'packages/nimbus-ui/src/*/style/index.less',
    generatedAt: new Date().toISOString(),
    summary: {
      components: components.length,
      total,
      mapped,
      unmapped,
    },
    components,
  };
}

function printReport(report) {
  console.log('Nimbus UI Token Governance Report');
  console.log('=================================');
  console.log(`Target: ${report.target}`);
  console.log(
    `Summary: ${report.summary.components} components, ${report.summary.total} hardcoded colors, ${report.summary.mapped} mapped, ${report.summary.unmapped} unmapped`,
  );
  console.log('');

  for (const component of report.components) {
    console.log(`${component.component} (${component.file})`);
    if (component.findings.length === 0) {
      console.log('  OK: no hardcoded colors found.');
      continue;
    }

    for (const finding of component.findings) {
      const suggestion = finding.token
        ? `suggest ${finding.token.lessVariable} (${finding.token.name})`
        : 'no token mapping found';
      console.log(`  L${finding.line} ${finding.property}: ${finding.value} -> ${suggestion}`);
    }
    console.log('');
  }
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

  if (process.argv.includes('--fail-on-unmapped') && report.summary.unmapped > 0) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  runCli();
}

module.exports = {
  createReport,
};
