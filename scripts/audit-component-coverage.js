#!/usr/bin/env node

/**
 * Component Coverage Audit Script
 * Analyzes tsconfig.base.json to identify components missing /testing exports
 */

const fs = require('fs');
const path = require('path');

function analyzeComponentCoverage() {
  const tsconfigPath = path.join(__dirname, '..', 'tsconfig.base.json');
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  
  const components = [];
  const componentPaths = tsconfig.compilerOptions.paths;
  
  for (const [packageName, paths] of Object.entries(componentPaths)) {
    if (packageName.startsWith('@skyux/') && !packageName.includes('/testing') && !packageName.includes('-sdk')) {
      const componentName = packageName.replace('@skyux/', '');
      const mainPath = paths[0];
      
      const testingPackageName = `${packageName}/testing`;
      const hasTestingExport = componentPaths[testingPackageName] !== undefined;
      
      const componentDir = mainPath.replace('/src/index.ts', '');
      const testingDir = path.join(componentDir, 'testing');
      const hasTestingDirectory = fs.existsSync(path.join(__dirname, '..', testingDir));
      
      components.push({
        name: componentName,
        packageName,
        mainPath,
        hasTestingExport,
        hasTestingDirectory,
        testingDir: hasTestingDirectory ? testingDir : null,
        status: getComponentStatus(hasTestingExport, hasTestingDirectory)
      });
    }
  }
  
  return components;
}

function getComponentStatus(hasTestingExport, hasTestingDirectory) {
  if (hasTestingExport && hasTestingDirectory) {
    return 'HAS_HARNESS';
  } else if (hasTestingDirectory) {
    return 'LEGACY_FIXTURES_ONLY';
  } else {
    return 'NO_TESTING';
  }
}

function generateReport(components) {
  const report = {
    summary: {
      total: components.length,
      hasHarness: components.filter(c => c.status === 'HAS_HARNESS').length,
      legacyFixturesOnly: components.filter(c => c.status === 'LEGACY_FIXTURES_ONLY').length,
      noTesting: components.filter(c => c.status === 'NO_TESTING').length
    },
    components: components.sort((a, b) => a.name.localeCompare(b.name))
  };
  
  return report;
}

function generateCSVReport(components) {
  const headers = ['Component Name', 'Package Name', 'Has Testing Export', 'Has Testing Directory', 'Status', 'Priority'];
  const rows = components.map(c => [
    c.name,
    c.packageName,
    c.hasTestingExport ? 'Yes' : 'No',
    c.hasTestingDirectory ? 'Yes' : 'No',
    c.status,
    getPriority(c.name)
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function getPriority(componentName) {
  const highPriority = ['modals', 'data-manager', 'grids', 'forms', 'lookup', 'datetime'];
  const mediumPriority = ['layout', 'indicators', 'popovers', 'tabs', 'tiles'];
  
  if (highPriority.includes(componentName)) return 'HIGH';
  if (mediumPriority.includes(componentName)) return 'MEDIUM';
  return 'LOW';
}

if (require.main === module) {
  try {
    console.log('🔍 Analyzing component coverage...\n');
    
    const components = analyzeComponentCoverage();
    const report = generateReport(components);
    
    const jsonReportPath = path.join(__dirname, '..', 'reports', 'component-coverage-audit.json');
    fs.mkdirSync(path.dirname(jsonReportPath), { recursive: true });
    fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
    
    const csvReportPath = path.join(__dirname, '..', 'reports', 'component-coverage-audit.csv');
    fs.writeFileSync(csvReportPath, generateCSVReport(components));
    
    console.log('📊 Component Coverage Summary:');
    console.log(`Total Components: ${report.summary.total}`);
    console.log(`✅ Has Harness: ${report.summary.hasHarness}`);
    console.log(`⚠️  Legacy Fixtures Only: ${report.summary.legacyFixturesOnly}`);
    console.log(`❌ No Testing: ${report.summary.noTesting}`);
    console.log(`\n📄 Reports generated:`);
    console.log(`- JSON: ${jsonReportPath}`);
    console.log(`- CSV: ${csvReportPath}`);
    
    const needsHarness = components.filter(c => c.status !== 'HAS_HARNESS');
    if (needsHarness.length > 0) {
      console.log(`\n🎯 Components needing harnesses (${needsHarness.length}):`);
      needsHarness.forEach(c => {
        console.log(`- ${c.name} (${c.status}) - Priority: ${getPriority(c.name)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error analyzing component coverage:', error.message);
    process.exit(1);
  }
}

module.exports = { analyzeComponentCoverage, generateReport };
