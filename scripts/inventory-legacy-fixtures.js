#!/usr/bin/env node

/**
 * Legacy Fixture Inventory Script
 * Catalogs all legacy fixtures and documents their APIs vs harness counterparts
 */

const fs = require('fs');
const path = require('path');

function findLegacyFixtures() {
  const componentsDir = path.join(__dirname, '..', 'libs', 'components');
  const fixtures = [];
  
  function scanDirectory(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativeEntryPath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath, relativeEntryPath);
      } else if (entry.name.includes('fixture') && entry.name.endsWith('.ts') && !entry.name.endsWith('.spec.ts')) {
        fixtures.push({
          name: entry.name,
          path: fullPath,
          relativePath: relativeEntryPath,
          component: getComponentFromPath(relativeEntryPath),
          isLegacy: relativeEntryPath.includes('/legacy/'),
          apis: extractFixtureAPIs(fullPath)
        });
      }
    }
  }
  
  scanDirectory(componentsDir);
  return fixtures;
}

function getComponentFromPath(relativePath) {
  const parts = relativePath.split('/');
  return parts[0];
}

function extractFixtureAPIs(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const apis = {
      className: extractClassName(content),
      publicMethods: extractPublicMethods(content),
      publicProperties: extractPublicProperties(content),
      deprecationNote: extractDeprecationNote(content)
    };
    return apis;
  } catch (error) {
    return { error: error.message };
  }
}

function extractClassName(content) {
  const match = content.match(/export class (\w+)/);
  return match ? match[1] : null;
}

function extractPublicMethods(content) {
  const methodRegex = /public\s+(?:async\s+)?(\w+)\s*\([^)]*\)\s*:\s*([^{]+)/g;
  const methods = [];
  let match;
  
  while ((match = methodRegex.exec(content)) !== null) {
    methods.push({
      name: match[1],
      returnType: match[2].trim()
    });
  }
  
  return methods;
}

function extractPublicProperties(content) {
  const propertyRegex = /public\s+get\s+(\w+)\s*\(\s*\)\s*:\s*([^{]+)/g;
  const properties = [];
  let match;
  
  while ((match = propertyRegex.exec(content)) !== null) {
    properties.push({
      name: match[1],
      type: match[2].trim()
    });
  }
  
  return properties;
}

function extractDeprecationNote(content) {
  const deprecatedMatch = content.match(/@deprecated\s+(.+)/);
  return deprecatedMatch ? deprecatedMatch[1].trim() : null;
}

function findCorrespondingHarness(fixture) {
  const componentDir = path.dirname(path.dirname(fixture.path));
  const harnessDir = path.join(componentDir, 'testing', 'src', 'modules');
  
  if (!fs.existsSync(harnessDir)) {
    return null;
  }
  
  function findHarnessFiles(dir) {
    const files = [];
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          files.push(...findHarnessFiles(fullPath));
        } else if (entry.name.includes('harness.ts') && !entry.name.includes('.spec.ts')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
    }
    return files;
  }
  
  const harnessFiles = findHarnessFiles(harnessDir);
  return harnessFiles.length > 0 ? harnessFiles : null;
}

function generateMigrationMapping(fixtures) {
  const mapping = {};
  
  for (const fixture of fixtures) {
    if (fixture.isLegacy && fixture.apis.deprecationNote) {
      const correspondingHarness = findCorrespondingHarness(fixture);
      mapping[fixture.apis.className] = {
        fixture: fixture,
        harness: correspondingHarness,
        migrationComplexity: assessMigrationComplexity(fixture, correspondingHarness)
      };
    }
  }
  
  return mapping;
}

function assessMigrationComplexity(fixture, harnessFiles) {
  if (!harnessFiles) return 'HIGH';
  
  const methodCount = fixture.apis.publicMethods?.length || 0;
  const propertyCount = fixture.apis.publicProperties?.length || 0;
  const totalAPIs = methodCount + propertyCount;
  
  if (totalAPIs > 10) return 'HIGH';
  if (totalAPIs > 5) return 'MEDIUM';
  return 'LOW';
}

function generateInventoryReport(fixtures) {
  const legacyFixtures = fixtures.filter(f => f.isLegacy);
  const migrationMapping = generateMigrationMapping(fixtures);
  
  return {
    summary: {
      totalFixtures: fixtures.length,
      legacyFixtures: legacyFixtures.length,
      componentsWithLegacyFixtures: [...new Set(legacyFixtures.map(f => f.component))].length,
      migrationCandidates: Object.keys(migrationMapping).length
    },
    legacyFixtures: legacyFixtures,
    migrationMapping: migrationMapping,
    allFixtures: fixtures
  };
}

if (require.main === module) {
  try {
    console.log('🔍 Inventorying legacy fixtures...\n');
    
    const fixtures = findLegacyFixtures();
    const report = generateInventoryReport(fixtures);
    
    const reportPath = path.join(__dirname, '..', 'reports', 'legacy-fixture-inventory.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Legacy Fixture Inventory Summary:');
    console.log(`Total Fixtures Found: ${report.summary.totalFixtures}`);
    console.log(`Legacy Fixtures: ${report.summary.legacyFixtures}`);
    console.log(`Components with Legacy Fixtures: ${report.summary.componentsWithLegacyFixtures}`);
    console.log(`Migration Candidates: ${report.summary.migrationCandidates}`);
    console.log(`\n📄 Report generated: ${reportPath}`);
    
    const byComponent = {};
    report.legacyFixtures.forEach(f => {
      if (!byComponent[f.component]) byComponent[f.component] = [];
      byComponent[f.component].push(f);
    });
    
    console.log('\n🎯 Legacy fixtures by component:');
    Object.entries(byComponent).forEach(([component, fixtures]) => {
      console.log(`\n${component}:`);
      fixtures.forEach(f => {
        const complexity = report.migrationMapping[f.apis.className]?.migrationComplexity || 'UNKNOWN';
        console.log(`  - ${f.apis.className} (${complexity} complexity)`);
      });
    });
    
  } catch (error) {
    console.error('❌ Error inventorying legacy fixtures:', error.message);
    process.exit(1);
  }
}

module.exports = { findLegacyFixtures, generateInventoryReport };
