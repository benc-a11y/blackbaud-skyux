# Legacy Fixture to Harness Migration Guide

This guide provides comprehensive instructions for migrating from legacy SKY UX fixtures to modern test harnesses.

## Overview

SKY UX is transitioning from legacy fixture-based testing to modern harness-based testing using Angular CDK Testing utilities. This migration provides:

- **Better async handling**: Harnesses use async/await patterns for more reliable tests
- **Improved maintainability**: Standardized patterns across all components
- **Enhanced reliability**: Built on Angular CDK Testing infrastructure
- **Future-proof**: Aligned with Angular testing best practices

## Migration Process

### Automated Migration

Use the provided schematic to automatically migrate your tests:

```bash
ng generate @skyux/packages:fixture-to-harness
```

For a specific path:
```bash
ng generate @skyux/packages:fixture-to-harness --path=src/app/components
```

For a dry-run preview:
```bash
ng generate @skyux/packages:fixture-to-harness --dry-run
```

### Manual Migration Steps

If you prefer manual migration or need to handle edge cases:

#### 1. Update Imports

**Before (Legacy Fixture):**
```typescript
import { SkyCheckboxFixture } from '@skyux/forms/testing';
```

**After (Modern Harness):**
```typescript
import { SkyCheckboxHarness } from '@skyux/forms/testing';
```

#### 2. Update Test Setup

**Before:**
```typescript
describe('Component tests', () => {
  let fixture: ComponentFixture<TestComponent>;
  let checkboxFixture: SkyCheckboxFixture;

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    checkboxFixture = new SkyCheckboxFixture(fixture, 'my-checkbox');
  });
});
```

**After:**
```typescript
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

describe('Component tests', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;

  async function setupTest(): Promise<{
    checkboxHarness: SkyCheckboxHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    fixture = TestBed.createComponent(TestComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    const checkboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'my-checkbox' })
    );
    
    return { checkboxHarness, fixture };
  }
});
```

#### 3. Update Test Methods

**Before (Synchronous):**
```typescript
it('should be selected', () => {
  expect(checkboxFixture.selected).toBe(true);
  expect(checkboxFixture.labelText).toBe('My Label');
  
  checkboxFixture.select();
  expect(checkboxFixture.selected).toBe(true);
});
```

**After (Asynchronous):**
```typescript
it('should be selected', async () => {
  const { checkboxHarness } = await setupTest();
  
  await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(true);
  await expectAsync(checkboxHarness.getLabelText()).toBeResolvedTo('My Label');
  
  await checkboxHarness.check();
  await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(true);
});
```

## Component-Specific Migration

### Checkbox Migration

| Legacy Fixture API | Modern Harness API |
|-------------------|-------------------|
| `fixture.selected` | `await harness.isChecked()` |
| `fixture.labelText` | `await harness.getLabelText()` |
| `fixture.disabled` | `await harness.isDisabled()` |
| `fixture.select()` | `await harness.check()` |
| `fixture.deselect()` | `await harness.uncheck()` |

### Modal Migration

| Legacy Fixture API | Modern Harness API |
|-------------------|-------------------|
| `fixture.size` | `await harness.getSize()` |
| `fixture.fullPage` | `await harness.isFullPage()` |
| `fixture.clickHeaderCloseButton()` | `await harness.clickCloseButton()` |
| `fixture.getModalContentEl()` | `await harness.getContent()` |

### Alert Migration

| Legacy Fixture API | Modern Harness API |
|-------------------|-------------------|
| `fixture.text` | `await harness.getText()` |
| `fixture.alertType` | `await harness.getAlertType()` |
| `fixture.closeable` | `await harness.isCloseable()` |
| `fixture.close()` | `await harness.close()` |

## Common Patterns

### Error Handling

**Before:**
```typescript
try {
  checkboxFixture.select();
} catch (error) {
  // Handle error
}
```

**After:**
```typescript
try {
  await checkboxHarness.check();
} catch (error) {
  // Handle error
}
```

### Conditional Logic

**Before:**
```typescript
if (checkboxFixture.selected) {
  checkboxFixture.deselect();
}
```

**After:**
```typescript
if (await checkboxHarness.isChecked()) {
  await checkboxHarness.uncheck();
}
```

### Multiple Components

**Before:**
```typescript
const checkbox1 = new SkyCheckboxFixture(fixture, 'checkbox-1');
const checkbox2 = new SkyCheckboxFixture(fixture, 'checkbox-2');
```

**After:**
```typescript
const checkbox1 = await loader.getHarness(
  SkyCheckboxHarness.with({ dataSkyId: 'checkbox-1' })
);
const checkbox2 = await loader.getHarness(
  SkyCheckboxHarness.with({ dataSkyId: 'checkbox-2' })
);
```

## Best Practices

### 1. Use setupTest Pattern

Create a reusable setup function for consistent harness initialization:

```typescript
async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  harness: SkyComponentHarness;
  fixture: ComponentFixture<TestComponent>;
}> {
  const fixture = TestBed.createComponent(TestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const harness = await loader.getHarness(
    SkyComponentHarness.with({ dataSkyId: options.dataSkyId || 'default-id' })
  );
  
  return { harness, fixture };
}
```

### 2. Handle Async Operations

Always use async/await with harness methods:

```typescript
// ✅ Correct
await expectAsync(harness.getText()).toBeResolvedTo('Expected text');

// ❌ Incorrect
expect(harness.getText()).toBe('Expected text');
```

### 3. Use Specific Selectors

Prefer data-sky-id attributes for reliable component selection:

```typescript
// ✅ Preferred
const harness = await loader.getHarness(
  SkyComponentHarness.with({ dataSkyId: 'my-component' })
);

// ⚠️ Less reliable
const harness = await loader.getHarness(SkyComponentHarness);
```

## Troubleshooting

### Common Issues

1. **"Cannot find harness" errors**
   - Ensure the component is rendered before getting the harness
   - Check that data-sky-id attributes are correctly set
   - Verify the harness selector matches the component

2. **Async/await issues**
   - All harness methods return Promises and must be awaited
   - Use `expectAsync()` for Promise-based assertions
   - Ensure test functions are marked as `async`

3. **Import errors**
   - Verify harness imports are from the correct testing package
   - Check that the harness exists for your component
   - Use the component coverage audit to identify missing harnesses

### Getting Help

- Check the [component coverage audit report](../reports/component-coverage-audit.json) for harness availability
- Review the [legacy fixture inventory](../reports/legacy-fixture-inventory.json) for migration complexity
- Refer to existing harness implementations in the codebase for patterns

## Migration Checklist

- [ ] Run automated migration schematic
- [ ] Update imports from fixtures to harnesses
- [ ] Add harness loader setup to tests
- [ ] Convert synchronous fixture calls to async harness calls
- [ ] Update assertions to use `expectAsync()`
- [ ] Test migrated code to ensure functionality
- [ ] Remove unused fixture imports
- [ ] Update any custom test utilities that used fixtures

## Next Steps

After migration:

1. **Remove legacy fixture dependencies** from your package.json if no longer needed
2. **Update documentation** to reference harness patterns instead of fixtures
3. **Train team members** on harness-based testing patterns
4. **Consider contributing** harness implementations for components that don't have them yet

For questions or issues with migration, please refer to the SKY UX testing documentation or create an issue in the repository.
