const fs = require('fs');
const path = require('path');
const { createReport: createComponentReport } = require('./analyzeComponents');
const { createReport: createTokenReport } = require('./scanTokens');

function createReport() {
  const componentReport = createComponentReport();
  const tokenReport = createTokenReport();
  const tokenByComponent = new Map(tokenReport.components.map(item => [item.component, item]));

  const components = componentReport.components.map(component => {
    const token = tokenByComponent.get(component.component);
    const tokenScore = token
      ? token.summary.total === 0
        ? 100
        : Math.round(((token.summary.total - token.summary.unmapped) / token.summary.total) * 100)
      : 100;
    const themeMigrated = token ? token.summary.total === 0 : false;
    const migrationScore = token ? (themeMigrated ? 100 : Math.max(0, 100 - token.summary.total * 5)) : 100;
    const score = Math.round(component.quality.score * 0.6 + tokenScore * 0.2 + migrationScore * 0.2);

    return {
      component: component.component,
      displayName: component.displayName,
      category: component.category,
      score,
      componentScore: component.quality.score,
      tokenScore,
      migrationScore,
      themeMigrated,
      hardcodedColors: token ? token.summary.total : 0,
      unmappedColors: token ? token.summary.unmapped : 0,
      missing: {
        story: !component.files.hasStory,
        test: !component.files.hasTest,
        doc: !component.files.hasDoc,
      },
      namingIssues: component.namingIssues,
    };
  });

  const averageScore = Math.round(components.reduce((sum, item) => sum + item.score, 0) / Math.max(components.length, 1));

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      components: components.length,
      averageScore,
      themeMigrated: components.filter(item => item.themeMigrated).map(item => item.component),
      hardcodedColors: components.reduce((sum, item) => sum + item.hardcodedColors, 0),
      unmappedColors: components.reduce((sum, item) => sum + item.unmappedColors, 0),
      missingStories: components.filter(item => item.missing.story).map(item => item.component),
      missingTests: components.filter(item => item.missing.test).map(item => item.component),
      namingIssues: components.reduce((sum, item) => sum + item.namingIssues.length, 0),
    },
    components,
  };
}

function printReport(report) {
  console.log('Nimbus UI Governance Summary');
  console.log('============================');
  console.log(`Components: ${report.summary.components}`);
  console.log(`Average score: ${report.summary.averageScore}`);
  console.log(`Theme migrated: ${report.summary.themeMigrated.join(', ') || 'none'}`);
  console.log(`Hardcoded colors: ${report.summary.hardcodedColors}`);
  console.log(`Unmapped colors: ${report.summary.unmappedColors}`);
  console.log('');

  for (const item of report.components) {
    console.log(
      `${item.displayName}: score ${item.score}, component ${item.componentScore}, token ${item.tokenScore}, migration ${item.migrationScore}, hardcoded colors ${item.hardcodedColors}`,
    );
  }
}

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

if (process.argv.includes('--fail-on-regression')) {
  const failed =
    report.summary.unmappedColors > 0 ||
    report.summary.missingStories.length > 0 ||
    report.summary.missingTests.length > 0 ||
    report.summary.namingIssues > 0;

  if (failed) process.exitCode = 1;
}
