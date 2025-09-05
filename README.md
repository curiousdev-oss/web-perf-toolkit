# Web Performance ESLint Plugin

[![npm version](https://badge.fury.io/js/@curiousdev-oss%2Feslint-plugin-web-perf.svg)](https://badge.fury.io/js/@curiousdev-oss%2Feslint-plugin-web-perf)
[![npm downloads](https://img.shields.io/npm/dm/@curiousdev-oss/eslint-plugin-web-perf.svg)](https://www.npmjs.com/package/@curiousdev-oss/eslint-plugin-web-perf)
[![npm publish](https://img.shields.io/npm/v/@curiousdev-oss/eslint-plugin-web-perf?color=success&label=latest)](https://www.npmjs.com/package/@curiousdev-oss/eslint-plugin-web-perf)
[![GitHub release](https://img.shields.io/github/release/curiousdev-oss/web-perf-toolkit.svg)](https://github.com/curiousdev-oss/web-perf-toolkit/releases)
[![Install size](https://packagephobia.com/badge?p=@curiousdev-oss/eslint-plugin-web-perf)](https://packagephobia.com/result?p=@curiousdev-oss/eslint-plugin-web-perf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive ESLint plugin with **18 performance-focused rules** designed to help developers write more performant JavaScript, TypeScript, and Angular applications.

> 🚀 **v0.1.4 Release** - Added 4 Angular-specific performance rules for better framework optimization!

## Overview

Web performance is critical for user experience and business success. This ESLint plugin helps catch performance issues during development, before they reach production. By enforcing best practices through automated linting, teams can maintain high performance standards consistently across their codebase.

## Installation

```bash
npm install --save-dev @curiousdev-oss/eslint-plugin-web-perf
```

## Quick Start

### ESLint Flat Config (Recommended)

```javascript
// eslint.config.js
import perfPlugin from "@curiousdev-oss/eslint-plugin-web-perf";

export default [
  {
    plugins: {
      "@curiousdev-oss/perf": perfPlugin,
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
  "plugins": ["@curiousdev-oss/perf"],
  "extends": ["plugin:@curiousdev-oss/perf/recommended"]
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
| **Angular Performance** | 4 rules | OnPush, trackBy, async pipe, NgOptimizedImage |

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

### Angular Performance
- `angular-onpush-change-detection` - Enforces ChangeDetectionStrategy.OnPush
- `angular-require-trackby` - Requires trackBy functions in *ngFor directives
- `angular-prefer-async-pipe` - Prefers async pipe over manual subscriptions
- `angular-img-ngoptimizedimage` - Suggests NgOptimizedImage and enforces dimensions

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

The repository includes a focused Angular test application demonstrating comprehensive performance issues:

- **Angular Sample** - Framework-specific optimizations with Angular performance patterns

Test the plugin effectiveness:

```bash
cd test-apps/angular-sample
npm install && npm run lint  # Detects 99+ performance issues
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

## Release Information

### Current Version: v0.1.4

**What's New in v0.1.4:**
- ✅ 18 comprehensive performance rules (+4 Angular-specific)
- ✅ 4 new Angular performance rules for better framework optimization
- ✅ Enhanced Angular preset configuration
- ✅ 247 unit tests with comprehensive coverage
- ✅ Angular-specific patterns: OnPush, trackBy, async pipe, NgOptimizedImage
- ✅ Focused Angular test application with 99+ detectable issues
- ✅ Streamlined monorepo structure
- ✅ Production-ready Angular performance linting

**Installation:**
```bash
npm install --save-dev @curiousdev-oss/eslint-plugin-web-perf@^0.1.4
```

### Roadmap
- **v0.1.x** - Bug fixes and Angular rule enhancements
- **v0.2.0** - Additional React-specific rules  
- **v0.3.0** - Vue.js framework support
- **v1.0.0** - Stable API with enterprise features

## Contributing

We welcome contributions that improve web performance tooling!

**Maintainer:** `@curiousdev-oss`

Please review the development guide and ensure all tests pass before submitting pull requests.

## License

MIT - See LICENSE file for details.