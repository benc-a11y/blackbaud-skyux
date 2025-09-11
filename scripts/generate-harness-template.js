#!/usr/bin/env node

/**
 * Harness Template Generator
 * Creates standardized harness templates following SkyComponentHarness patterns
 */

const fs = require('fs');
const path = require('path');

function generateHarnessTemplate(componentName, options = {}) {
  const {
    selector = `sky-${componentName}`,
    hasFilters = true,
    methods = [],
    properties = []
  } = options;
  
  const className = `Sky${toPascalCase(componentName)}Harness`;
  const filtersClassName = `${className}Filters`;
  
  const template = `import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

${hasFilters ? `import { ${filtersClassName} } from './${componentName}-harness-filters';` : ''}

/**
 * Harness for interacting with a ${componentName} component in tests.
 */
export class ${className} extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = '${selector}';

  ${generatePrivateLocators(methods, properties)}

  /**
   * Gets a \`HarnessPredicate\` that can be used to search for a
   * \`${className}\` that meets certain criteria.
   */
  public static with(
    filters: ${hasFilters ? filtersClassName : 'SkyHarnessFilters'},
  ): HarnessPredicate<${className}> {
    return ${className}.getDataSkyIdPredicate(filters);
  }

  ${generatePublicMethods(methods)}

  ${generatePublicProperties(properties)}
}
`;

  return template;
}

function generateFiltersTemplate(componentName) {
  const className = `Sky${toPascalCase(componentName)}HarnessFilters`;
  
  return `import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of \`Sky${toPascalCase(componentName)}Harness\` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface ${className} extends SkyHarnessFilters {}
`;
}

function generateSpecTemplate(componentName) {
  const className = `Sky${toPascalCase(componentName)}Harness`;
  const testComponentName = `Test${toPascalCase(componentName)}Component`;
  
  return `import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Sky${toPascalCase(componentName)}Module } from '@skyux/${componentName}';

import { ${className} } from './${componentName}-harness';

@Component({
  selector: 'sky-${componentName}-test',
  template: \`
    <sky-${componentName}
      data-sky-id="${componentName}-test"
    >
      <!-- Add test content here -->
    </sky-${componentName}>
  \`,
  standalone: false,
})
class ${testComponentName} {
}

describe('${toPascalCase(componentName)} harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    ${componentName}Harness: ${className};
    fixture: ComponentFixture<${testComponentName}>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      declarations: [${testComponentName}],
      imports: [Sky${toPascalCase(componentName)}Module, NoopAnimationsModule],
    });

    const fixture = TestBed.createComponent(${testComponentName});
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const ${componentName}Harness: ${className} = options.dataSkyId
      ? await loader.getHarness(
          ${className}.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(${className});

    return { ${componentName}Harness, fixture, loader };
  }

  it('should get the ${componentName} from its data-sky-id', async () => {
    const { ${componentName}Harness } = await setupTest({
      dataSkyId: '${componentName}-test',
    });

    expect(${componentName}Harness).toBeTruthy();
  });

});
`;
}

function generatePrivateLocators(methods, properties) {
  const locators = [];
  
  if (methods.some(m => m.name.includes('click') || m.name.includes('button'))) {
    locators.push('#getButton = this.locatorFor(\'button\');');
  }
  
  if (properties.some(p => p.name.includes('text') || p.name.includes('label'))) {
    locators.push('#getLabel = this.locatorForOptional(\'.sky-control-label\');');
  }
  
  return locators.length > 0 ? locators.join('\n  ') + '\n' : '';
}

function generatePublicMethods(methods) {
  return methods.map(method => {
    const methodName = method.name;
    const returnType = method.returnType || 'Promise<void>';
    
    return `  /**
   * ${method.description || `${methodName.charAt(0).toUpperCase() + methodName.slice(1)} the component.`}
   */
  public async ${methodName}(): ${returnType} {
    throw new Error('Method ${methodName} not implemented');
  }`;
  }).join('\n\n');
}

function generatePublicProperties(properties) {
  return properties.map(property => {
    const propertyName = property.name;
    const returnType = property.type || 'Promise<string | null>';
    
    return `  /**
   * Gets the ${propertyName} of the component.
   */
  public async get${toPascalCase(propertyName)}(): ${returnType} {
    throw new Error('Property get${toPascalCase(propertyName)} not implemented');
  }`;
  }).join('\n\n');
}

function toPascalCase(str) {
  return str.replace(/(^|-)([a-z])/g, (_, __, letter) => letter.toUpperCase());
}

function generateHarnessFiles(componentName, outputDir, options = {}) {
  const files = {};
  
  files[`${componentName}-harness.ts`] = generateHarnessTemplate(componentName, options);
  
  if (options.hasFilters !== false) {
    files[`${componentName}-harness-filters.ts`] = generateFiltersTemplate(componentName);
  }
  
  files[`${componentName}-harness.spec.ts`] = generateSpecTemplate(componentName);
  
  if (outputDir) {
    fs.mkdirSync(outputDir, { recursive: true });
    Object.entries(files).forEach(([filename, content]) => {
      const filePath = path.join(outputDir, filename);
      fs.writeFileSync(filePath, content);
      console.log(`✅ Generated: ${filePath}`);
    });
  }
  
  return files;
}

if (require.main === module) {
  const componentName = process.argv[2];
  const outputDir = process.argv[3];
  
  if (!componentName) {
    console.error('Usage: node generate-harness-template.js <component-name> [output-dir]');
    process.exit(1);
  }
  
  try {
    console.log(`🏗️  Generating harness template for ${componentName}...\n`);
    
    const files = generateHarnessFiles(componentName, outputDir);
    
    if (!outputDir) {
      console.log('📄 Generated files (preview):');
      Object.entries(files).forEach(([filename, content]) => {
        console.log(`\n--- ${filename} ---`);
        console.log(content.substring(0, 200) + '...');
      });
    }
    
    console.log(`\n✅ Harness template generation complete!`);
    
  } catch (error) {
    console.error('❌ Error generating harness template:', error.message);
    process.exit(1);
  }
}

module.exports = { generateHarnessTemplate, generateHarnessFiles };
