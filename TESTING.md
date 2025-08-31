# Testing Guide

This document explains all the testing scenarios and scripts available in the `web-perf-toolkit` repository.

## Quick Test Commands

### **Full Test Suite**

```bash
npm run test:all          # Complete test suite (build + unit + integration)
npm run test:integration  # Integration tests only
```

### **Individual Component Tests**

```bash
npm run test:eslint       # Test all ESLint plugin scenarios
npm run test:api          # Test programmatic APIs
```

## Test Scripts Overview

| Script                | Purpose                | What It Tests                            |
| --------------------- | ---------------------- | ---------------------------------------- |
| `test:all`            | Complete test suite    | Build + unit tests + integration tests   |
| `test:integration`    | Integration tests      | ESLint plugin + API verification         |
| `test:eslint`         | ESLint plugin tests    | All test apps (TS, Angular, JS)          |
| `test:eslint:ts`      | TypeScript sample      | 70+ performance issues detection         |
| `test:eslint:angular` | Angular sample         | 80+ performance issues detection         |
| `test:eslint:js`      | JavaScript sample      | 45+ performance issues detection         |
| `test:api`            | API verification       | Module loading verification              |

## ESLint Plugin Test Scenarios

### **TypeScript Sample (`test:eslint:ts`)**

- **Expected Issues**: 70+ errors
- **Test File**: `test-apps/ts-sample/src/performance-issues.ts`
- **Key Test Areas**:
  - Bundle size optimization (lodash, rxjs, date-fns)
  - Memory leak detection (setInterval, DOM references)
  - DOM performance (layout thrashing, expensive operations)
  - Core Web Vitals (image dimensions, lazy loading)
  - Algorithm efficiency (data structures, loops)

### **Angular Sample (`test:eslint:angular`)**

- **Expected Issues**: 80+ issues (errors and warnings)
- **Test File**: `test-apps/angular-sample/src/app/performance-issues.component.ts`
- **Key Test Areas**:
  - Angular-specific patterns (Observable subscriptions)
  - Framework memory management
  - Template optimization (image dimensions, lazy loading)
  - Angular lifecycle considerations

### **JavaScript Sample (`test:eslint:js`)**

- **Expected Issues**: 45+ issues (errors and warnings)
- **Test File**: `test-apps/js-sample/performance-issues.js`
- **Key Test Areas**:
  - Vanilla JS performance patterns
  - DOM manipulation efficiency
  - Memory management in plain JavaScript
  - Bundle optimization for vanilla projects

## API Verification

### **API Testing (`test:api`)**

- **Module Loading**: Ensures ESLint plugin exports are accessible
- **Import Testing**: Verifies ES module imports work correctly

## Development Workflow

### **Before Committing**

```bash
npm run test:all          # Run complete test suite
```

### **During Development**

```bash
npm run test:eslint       # Quick ESLint plugin tests
```

### **Before Publishing**

```bash
npm run prepublishOnly    # Automatically runs test:all
```

## Expected Test Results

### **ESLint Plugin Results**

| Test App   | Expected Issues | Rule Categories                       |
| ---------- | --------------- | ------------------------------------- |
| TypeScript | 70+ errors      | Bundle, Memory, DOM, Core Web Vitals  |
| Angular    | 80+ issues      | Framework-specific + general patterns |
| JavaScript | 45+ issues      | Vanilla JS patterns                   |

## Troubleshooting

### **Common Issues**

**Build Errors:**

```bash
npm run build:clean      # Clean build cache
npm run clean           # Remove all generated files
```

**Test App Issues:**

```bash
npm run clean           # Clean test app dependencies
npm run test:eslint     # Reinstall and test
```

**API Import Issues:**

```bash
npm run build           # Ensure package is built
npm run test:api        # Verify imports work
```

### **Performance Issue Detection**

The test apps are intentionally written with performance anti-patterns to verify rule detection:

- **Bundle Issues**: Large library imports, namespace imports
- **Memory Issues**: setInterval, DOM references, subscriptions
- **DOM Issues**: Layout thrashing, expensive operations in loops
- **Core Web Vitals**: Missing image dimensions, no lazy loading
- **Algorithm Issues**: Inefficient data structures, nested loops

## Continuous Integration

These test scripts are designed for CI/CD pipelines:

```yaml
# GitHub Actions example
- name: Test ESLint Plugin
  run: npm run test:eslint

- name: Full Integration Test
  run: npm run test:integration
```

## Test Coverage

The test suite covers:

- ✅ **ESLint Plugin**: All 14 performance rules
- ✅ **Framework Support**: TypeScript, Angular, JavaScript
- ✅ **Build System**: TypeScript compilation and packaging
- ✅ **Integration**: End-to-end functionality verification

## Adding New Tests

To add new test scenarios:

1. **Create test file** in appropriate test app
2. **Add performance anti-patterns** to trigger rules
3. **Update expected issue counts** in this documentation
4. **Add new test script** to package.json if needed
5. **Update integration tests** to include new scenarios

## Test File Examples

### TypeScript Anti-patterns

```typescript
// Bundle size issues
import * as lodash from 'lodash'; // Heavy namespace import
import * as moment from 'moment'; // Heavy library

// Memory leaks
setInterval(() => console.log('leak'), 1000); // No cleanup
element.addEventListener('click', handler); // No removal

// DOM performance
for (let i = 0; i < items.length; i++) {
  document.querySelector(`#item-${i}`); // DOM query in loop
}

// Missing dimensions
<img src="photo.jpg" alt="Photo" /> // CLS risk
```

### Angular-specific Patterns

```typescript
// Component lifecycle issues
export class Component {
  ngOnInit() {
    this.subscription = observable.subscribe(); // No unsubscribe
  }
  // Missing ngOnDestroy
}

// Template issues
<img [src]="imageUrl" /> // Missing dimensions
```

These examples help verify that the ESLint plugin correctly identifies and reports performance issues across different JavaScript environments and frameworks.