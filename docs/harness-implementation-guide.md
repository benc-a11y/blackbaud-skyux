# SKY UX Harness Implementation Guide

This guide provides detailed instructions for implementing test harnesses for SKY UX components following established patterns and best practices.

## Overview

Test harnesses provide a reliable, maintainable way to interact with components in tests. They abstract away implementation details and provide a stable API for testing component behavior.

## Harness Architecture

All SKY UX harnesses follow a consistent architecture:

```
component-name/
├── component-name-harness.ts          # Main harness implementation
├── component-name-harness-filters.ts  # Filter interface for harness queries
└── component-name-harness.spec.ts     # Harness tests
```

## Implementation Steps

### 1. Create the Harness Class

Create the main harness file extending `SkyComponentHarness`:

```typescript
import { HarnessPredicate } from '@angular/cdk/testing';
import { SkyComponentHarness } from '@skyux/core/testing';

import { SkyComponentNameHarnessFilters } from './component-name-harness-filters';

/**
 * Harness for interacting with a component-name component in tests.
 */
export class SkyComponentNameHarness extends SkyComponentHarness {
  /**
   * @internal
   */
  public static hostSelector = 'sky-component-name';

  // Private locators using # syntax
  #getButton = this.locatorFor('button');
  #getLabel = this.locatorForOptional('.sky-control-label');

  /**
   * Gets a `HarnessPredicate` that can be used to search for a
   * `SkyComponentNameHarness` that meets certain criteria.
   */
  public static with(
    filters: SkyComponentNameHarnessFilters,
  ): HarnessPredicate<SkyComponentNameHarness> {
    return SkyComponentNameHarness.getDataSkyIdPredicate(filters);
  }

  // Public methods for component interaction
  public async click(): Promise<void> {
    const button = await this.#getButton();
    await button.click();
  }

  public async getText(): Promise<string> {
    const label = await this.#getLabel();
    return label ? await label.text() : '';
  }
}
```

### 2. Create the Filters Interface

Create the filters file for harness queries:

```typescript
import { SkyHarnessFilters } from '@skyux/core/testing';

/**
 * A set of criteria that can be used to filter a list of `SkyComponentNameHarness` instances.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-empty-object-type
export interface SkyComponentNameHarnessFilters extends SkyHarnessFilters {}
```

### 3. Create Harness Tests

Create comprehensive tests for the harness:

```typescript
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyComponentNameModule } from '@skyux/component-name';

import { SkyComponentNameHarness } from './component-name-harness';

//#region Test component
@Component({
  selector: 'sky-component-name-test',
  template: `
    <sky-component-name
      data-sky-id="component-name-test"
    >
      Test Content
    </sky-component-name>
  `,
  standalone: false,
})
class TestComponentNameComponent {
  // Test properties
}
//#endregion Test component

describe('ComponentName harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    componentNameHarness: SkyComponentNameHarness;
    fixture: ComponentFixture<TestComponentNameComponent>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      declarations: [TestComponentNameComponent],
      imports: [SkyComponentNameModule, NoopAnimationsModule],
    });

    const fixture = TestBed.createComponent(TestComponentNameComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const componentNameHarness: SkyComponentNameHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyComponentNameHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyComponentNameHarness);

    return { componentNameHarness, fixture, loader };
  }

  it('should get the component from its data-sky-id', async () => {
    const { componentNameHarness } = await setupTest({
      dataSkyId: 'component-name-test',
    });

    expect(componentNameHarness).toBeTruthy();
  });

  // Add more specific tests
});
```

### 4. Update Public API

Add the harness exports to the component's testing public API:

```typescript
// In libs/components/component-name/testing/src/public-api.ts
export { SkyComponentNameHarness } from './modules/component-name/component-name-harness';
export { SkyComponentNameHarnessFilters } from './modules/component-name/component-name-harness-filters';
```

## Best Practices

### Locator Patterns

Use private locators with the `#` syntax for internal element queries:

```typescript
// ✅ Good - Private locators
#getButton = this.locatorFor('button');
#getOptionalElement = this.locatorForOptional('.optional-class');
#getAllItems = this.locatorForAll('.item');

// ❌ Avoid - Public locators
getButton = this.locatorFor('button');
```

### Method Naming

Follow consistent naming conventions:

```typescript
// State queries - use "is" or "has" prefix
public async isDisabled(): Promise<boolean>
public async hasError(): Promise<boolean>

// Property getters - use "get" prefix
public async getText(): Promise<string>
public async getValue(): Promise<string | null>

// Actions - use imperative verbs
public async click(): Promise<void>
public async select(): Promise<void>
public async clear(): Promise<void>
```

### Error Handling

Provide clear error messages for invalid states:

```typescript
public async clickButton(): Promise<void> {
  const button = await this.#getButton();
  
  if (await button.hasClass('disabled')) {
    throw new Error('Cannot click button because it is disabled.');
  }
  
  await button.click();
}
```

### Async Patterns

All harness methods should be async and return Promises:

```typescript
// ✅ Good - Async methods
public async getText(): Promise<string>
public async isVisible(): Promise<boolean>

// ❌ Avoid - Synchronous methods
public getText(): string
public isVisible(): boolean
```

### Component State Validation

Validate component state before performing actions:

```typescript
public async selectOption(value: string): Promise<void> {
  const dropdown = await this.#getDropdown();
  
  if (await dropdown.hasClass('sky-dropdown-disabled')) {
    throw new Error('Cannot select option because dropdown is disabled.');
  }
  
  await dropdown.click();
  
  const option = await this.locatorFor(`[data-value="${value}"]`)();
  await option.click();
}
```

## Advanced Patterns

### Child Harness Composition

Use child harnesses for complex components:

```typescript
import { SkyButtonHarness } from '@skyux/buttons/testing';

export class SkyComplexComponentHarness extends SkyComponentHarness {
  #getSubmitButton = this.locatorFor(SkyButtonHarness.with({ text: 'Submit' }));
  
  public async clickSubmit(): Promise<void> {
    const submitButton = await this.#getSubmitButton();
    await submitButton.click();
  }
}
```

### Dynamic Content Handling

Handle dynamic content with proper waiting:

```typescript
public async waitForContent(): Promise<void> {
  await this.waitForTasksOutsideAngular();
  
  const content = await this.locatorFor('.content')();
  await this.waitForTasksOutsideAngular();
}
```

### Multiple Instance Support

Support multiple instances of the same component:

```typescript
public static async getAllInstances(
  loader: HarnessLoader,
  filters?: SkyComponentHarnessFilters
): Promise<SkyComponentHarness[]> {
  return await loader.getAllHarnesses(
    SkyComponentHarness.with(filters || {})
  );
}
```

## Testing Guidelines

### Test Coverage

Ensure comprehensive test coverage for harnesses:

1. **Basic functionality** - Component can be found and basic methods work
2. **State queries** - All getter methods return correct values
3. **Actions** - All action methods perform expected operations
4. **Error conditions** - Error handling works correctly
5. **Edge cases** - Boundary conditions and unusual states

### Test Organization

Organize tests logically:

```typescript
describe('ComponentName harness', () => {
  // Setup function
  async function setupTest() { /* ... */ }
  
  describe('basic functionality', () => {
    // Basic tests
  });
  
  describe('state queries', () => {
    // Getter method tests
  });
  
  describe('actions', () => {
    // Action method tests
  });
  
  describe('error handling', () => {
    // Error condition tests
  });
});
```

## Migration from Fixtures

When migrating from legacy fixtures:

1. **Map fixture APIs** to equivalent harness methods
2. **Convert synchronous calls** to async/await patterns
3. **Update test assertions** to use `expectAsync()`
4. **Add proper error handling** for invalid states
5. **Follow harness patterns** instead of direct DOM manipulation

## Validation Checklist

Before submitting a harness implementation:

- [ ] Extends `SkyComponentHarness`
- [ ] Uses private locators with `#` syntax
- [ ] Implements `static with()` method
- [ ] All methods are async and return Promises
- [ ] Includes comprehensive tests
- [ ] Added to public API exports
- [ ] Follows naming conventions
- [ ] Includes proper error handling
- [ ] Documentation is complete and accurate

## Resources

- [Angular CDK Testing Documentation](https://material.angular.io/cdk/testing/overview)
- [SKY UX Component Harness Examples](../libs/components/help-inline/testing/src/modules/help-inline/)
- [Component Coverage Audit Report](../reports/component-coverage-audit.json)
- [Legacy Fixture Migration Guide](./migration-guides/fixture-to-harness-migration.md)

For questions or guidance on harness implementation, refer to existing harness implementations in the codebase or consult the SKY UX team.
