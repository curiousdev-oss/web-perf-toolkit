# Web Performance ESLint Plugin

A comprehensive ESLint plugin with 14 performance-focused rules designed to help developers write more performant JavaScript, TypeScript, and Angular applications.

## Overview

Web performance is critical for user experience and business success. This ESLint plugin helps catch performance issues during development, before they reach production. By enforcing best practices through automated linting, teams can maintain high performance standards consistently across their codebase.

## Installation

```bash
npm install --save-dev @web-perf-toolkit/eslint-plugin-perf
```

## Quick Start

### ESLint Flat Config (Recommended)

```javascript
// eslint.config.js
import perfPlugin from "@web-perf-toolkit/eslint-plugin-perf";

export default [
  {
    plugins: {
      "@web-perf-toolkit/perf": perfPlugin,
    },
    // Choose your configuration
    ...perfPlugin.configs.recommended, // Balanced approach
    ...perfPlugin.configs.strict,      // Maximum performance
    ...perfPlugin.configs.angular,     // Angular-optimized
  },
];
```

### Legacy Configuration

```json
{
  "plugins": ["@web-perf-toolkit/perf"],
  "extends": ["plugin:@web-perf-toolkit/perf/recommended"]
}
```

## Core Features

### Core Web Vitals Optimization
Rules targeting Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS) metrics that directly impact user experience.

### Bundle Size Management
Intelligent detection of imports and patterns that unnecessarily increase bundle size, with suggestions for tree-shaking and code-splitting opportunities.

### Memory Leak Prevention
Automatic detection of common memory leak patterns including uncleaned event listeners, timers, and subscription management.

### Modern Web Standards
Guidance for migrating from legacy APIs to modern, more performant alternatives.

## Rule Categories

| Category | Rules | Focus Area |
|----------|-------|------------|
| **Core Web Vitals** | 4 rules | LCP, FID, CLS optimization |
| **Bundle Optimization** | 3 rules | Import efficiency, lazy loading |
| **Memory & Performance** | 3 rules | Memory management, algorithms |
| **Modern Web Standards** | 4 rules | API modernization, DOM efficiency |

## Complete Rule Set

### Core Web Vitals
- `img-requires-dimensions` - Prevents layout shifts from images without dimensions
- `prefer-web-vitals-optimizations` - Comprehensive Core Web Vitals best practices
- `no-render-blocking-resources` - Eliminates render-blocking resource patterns
- `prefer-resource-hints` - Enforces strategic preload/prefetch usage

### Bundle Optimization
- `no-heavy-namespace-imports` - Prevents importing entire heavy libraries
- `prefer-lazy-loading` - Encourages code splitting and lazy loading
- `no-large-bundle-imports` - Smart bundle size management

### Memory & Performance
- `no-memory-leaks` - Detects common memory leak patterns
- `no-sync-apis-in-render` - Prevents blocking operations in render functions
- `prefer-efficient-data-structures` - Suggests optimal algorithms and data structures

### Modern Web Standards
- `prefer-modern-apis` - Guides migration from legacy to modern APIs
- `no-blocking-apis` - Enforces asynchronous operation patterns
- `no-expensive-dom-operations` - Optimizes DOM manipulation performance
- `no-inefficient-loops` - Prevents performance issues in loop constructs

## Configuration Presets

### Recommended
Balanced rule set suitable for most projects. Catches major performance issues without being overly restrictive.

### Strict
Maximum performance enforcement for performance-critical applications. Enables all rules with strictest settings.

### Angular
Optimized for Angular applications, including framework-specific patterns and lifecycle considerations.

## Performance Impact

Development teams using this plugin typically observe:

- Significant improvements in Core Web Vitals metrics
- Reduced bundle sizes through better import management
- Fewer memory-related performance issues in production
- More consistent performance patterns across team members

## Sample Applications

The repository includes test applications demonstrating common performance issues:

- **TypeScript Sample** - General performance anti-patterns
- **Angular Sample** - Framework-specific optimizations  
- **JavaScript Sample** - Vanilla JavaScript performance patterns

Test the plugin effectiveness:

```bash
cd test-apps/ts-sample
npx eslint src/performance-issues.ts  # Detects 70+ performance issues
```

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Run tests
npm run test

# Test with sample applications
npm run test:eslint
```

For detailed development information, see [dev-guide.md](./dev-guide.md).

## Contributing

We welcome contributions that improve web performance tooling. Please review the development guide and ensure all tests pass before submitting pull requests.

## License

MIT - See LICENSE file for details.