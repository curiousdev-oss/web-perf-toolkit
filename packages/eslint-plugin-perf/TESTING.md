# Testing Guide for ESLint Plugin Performance

This document provides comprehensive information about testing the web-perf-toolkit ESLint plugin.

## 🧪 Test Structure

```
tests/
├── setup.ts                 # Test setup and global utilities
├── index.test.ts           # Tests for main plugin index
├── rules/                  # Tests for individual rules
│   ├── img-requires-dimensions.test.ts
│   ├── no-blocking-apis.test.ts
│   ├── no-heavy-namespace-imports.test.ts
│   └── prefer-lazy-loading.test.ts
└── run-tests.sh            # Test runner script
```

## 🚀 Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run tests with verbose output
npm run test:verbose
```

### Advanced Test Commands

```bash
# Run specific test suites
npm run test:rules          # Only rule tests
npm run test:index          # Only index tests
npm run test:unit           # Only unit tests

# Run tests with different configurations
npm run test:ci             # CI mode with coverage
npm run test:debug          # Debug mode with open handles detection
npm run test:coverage:html  # HTML coverage report

# Run all tests including linting
npm run test:all

# Run full test suite (unit + integration)
npm run test:full
```

### Using the Test Runner Script

```bash
# Make script executable (first time only)
chmod +x tests/run-tests.sh

# Run all tests
./tests/run-tests.sh

# Run specific test types
./tests/run-tests.sh rules
./tests/run-tests.sh index
./tests/run-tests.sh unit

# Run with coverage
./tests/run-tests.sh coverage

# Run in CI mode
./tests/run-tests.sh ci
```

## 📊 Coverage Requirements

The project maintains high test coverage standards:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

Coverage reports are generated in multiple formats:
- **Text**: Console output
- **LCOV**: For CI/CD integration
- **HTML**: Detailed browser-based report

## 🧩 Test Utilities

### Global Test Helpers

The `tests/setup.ts` file provides global utilities:

```typescript
// Create mock ESLint context
const context = createESLintContext({
  report: jest.fn(),
  options: [{ deny: ['lodash'] }]
});

// Create AST nodes for testing
const node = createJSXOpeningElement('img', [
  createJSXAttribute('src', createLiteral('test.jpg'))
]);

// Create mock context with specific options
const mockContext = createMockContext({
  report: jest.fn(),
  options: [{ deny: ['moment'] }]
});
```

### AST Node Creators

```typescript
// JSX Elements
createJSXOpeningElement(name, attributes)
createJSXAttribute(name, value)

// Literals and Expressions
createLiteral(value)
createTemplateLiteral(quasis, expressions)
createMemberExpression(object, property)
createCallExpression(callee, arguments)
createIdentifier(name)
```

## 🔧 Writing Tests

### Test Structure

Each test file should follow this pattern:

```typescript
import ruleName from '../../src/rules/rule-name';

describe('rule-name', () => {
  let context: any;
  let reportSpy: jest.Mock;

  beforeEach(() => {
    reportSpy = jest.fn();
    context = {
      report: reportSpy,
      // ... other context properties
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rule Behavior', () => {
    it('should report error for invalid code', () => {
      // Test implementation
    });

    it('should not report error for valid code', () => {
      // Test implementation
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined gracefully', () => {
      // Test implementation
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      // Test metadata
    });
  });
});
```

### Testing Rule Contexts

```typescript
// Test JSX elements
rule.JSXOpeningElement(node);

// Test template literals
rule.TemplateLiteral(node);

// Test import declarations
rule.ImportDeclaration(node);

// Test member expressions
rule.MemberExpression(node);

// Test call expressions
rule.CallExpression(node);
```

### Testing Error Reporting

```typescript
// Verify error was reported
expect(reportSpy).toHaveBeenCalledWith({
  node,
  message: 'Expected error message'
});

// Verify no error was reported
expect(reportSpy).not.toHaveBeenCalled();

// Verify specific number of reports
expect(reportSpy).toHaveBeenCalledTimes(2);
```

## 🏗️ CI/CD Integration

### GitHub Actions

The plugin includes CI configuration for automated testing:

```yaml
- name: Run Tests
  run: npm run test:ci

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: packages/eslint-plugin-perf/coverage/lcov.info
```

### Pre-commit Hooks

Tests run automatically before publishing:

```json
{
  "scripts": {
    "prepublishOnly": "npm run test:all"
  }
}
```

## 🐛 Debugging Tests

### Debug Mode

```bash
npm run test:debug
```

This mode:
- Detects open handles
- Provides detailed error information
- Runs tests sequentially

### Verbose Output

```bash
npm run test:verbose
```

Shows:
- Individual test results
- Detailed error messages
- Test execution flow

### Watch Mode

```bash
npm run test:watch
```

Features:
- Automatic re-running on file changes
- Interactive test selection
- Fast feedback loop

## 📈 Performance Testing

### Test Execution Time

Tests are configured to run efficiently:
- **Timeout**: 10 seconds per test
- **Parallelization**: Disabled for stability
- **Memory**: Optimized for CI environments

### Coverage Analysis

```bash
# Generate coverage report
npm run test:coverage

# Open HTML coverage report
open packages/eslint-plugin-perf/coverage/index.html
```

## 🔍 Test Patterns

### Rule Testing Patterns

1. **Valid Code**: Should not trigger reports
2. **Invalid Code**: Should trigger appropriate reports
3. **Edge Cases**: Handle null/undefined gracefully
4. **Configuration**: Test different rule options
5. **Metadata**: Verify rule properties

### Integration Testing

```bash
# Test ESLint integration
npm run test:eslint

# Test API loading
npm run test:api

# Test full integration
npm run test:integration
```

## 📚 Best Practices

1. **Test Coverage**: Aim for 100% coverage of rule logic
2. **Edge Cases**: Test null, undefined, and malformed inputs
3. **Performance**: Keep tests fast and efficient
4. **Maintainability**: Use descriptive test names and clear structure
5. **Documentation**: Document complex test scenarios

## 🚨 Common Issues

### Test Failures

- Check Jest configuration
- Verify TypeScript compilation
- Ensure all dependencies are installed
- Check for syntax errors in test files

### Coverage Issues

- Verify coverage thresholds in Jest config
- Check for untested code paths
- Ensure all rule branches are covered

### Performance Issues

- Use `--runInBand` for stability
- Monitor memory usage in CI
- Optimize test setup and teardown

## 📞 Getting Help

For testing issues:

1. Check this documentation
2. Review Jest and TypeScript configurations
3. Examine existing test examples
4. Check CI logs for detailed error information

## 🔄 Continuous Improvement

The testing suite is continuously improved:

- New rules include comprehensive tests
- Existing tests are enhanced for better coverage
- Performance optimizations are regularly applied
- Best practices are updated based on experience
