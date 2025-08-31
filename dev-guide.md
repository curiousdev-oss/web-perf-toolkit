# web-perf-toolkit Developer Guide

## Overview

`web-perf-toolkit` is a TypeScript-based ESLint plugin designed to help developers write more performant web applications by catching performance issues during development.

## Package: @curiousdev-oss/eslint-plugin-web-perf

### Installation

```bash
npm install -D @curiousdev-oss/eslint-plugin-web-perf
```

### Configuration

#### ESLint Flat Config (recommended)

```javascript
// eslint.config.js
import perf from "@curiousdev-oss/eslint-plugin-web-perf";

export default [perf.configs.recommended];
```

#### Legacy .eslintrc

```json
{
  "plugins": ["@curiousdev-oss/perf"],
  "extends": ["plugin:@curiousdev-oss/perf/recommended"]
}
```

### Available Configurations

The plugin provides three preset configurations:

- **`recommended`**: Balanced rules for most JavaScript/TypeScript projects
- **`strict`**: Stricter rules for performance-critical applications
- **`angular`**: Optimized for Angular applications with framework-specific patterns

```javascript
// Use specific config
import perf from "@curiousdev-oss/eslint-plugin-web-perf";

export default [
  perf.configs.recommended, // or .strict or .angular
];
```

### Rules

#### Core Performance Rules

##### `@curiousdev-oss/perf/no-blocking-apis`

Prevents synchronous/blocking APIs that freeze the main thread.

```javascript
// ❌ Bad - blocks main thread
const data = localStorage.getItem("user"); // Flagged
const result = JSON.parse(largeData); // Flagged for large data
alert("Hello!"); // Flagged - use modals
const file = fs.readFileSync("./data.json"); // Flagged

// ✅ Good - async alternatives
const data = await asyncStorage.getItem("user");
const result = await streamingJsonParser.parse(largeData);
showToast("Hello!"); // Non-blocking notification
const file = await fs.promises.readFile("./data.json");
```

##### `@curiousdev-oss/perf/no-heavy-namespace-imports`

Prevents importing entire heavy libraries that hurt bundle size.

```javascript
// ❌ Bad - imports entire library
import * as _ from "lodash"; // ~70KB
import * as moment from "moment"; // ~60KB
import * as d3 from "d3"; // ~200KB

// ✅ Good - tree-shakeable imports
import { debounce } from "lodash";
import { format } from "date-fns"; // lighter alternative
import { scaleLinear } from "d3-scale";
```

##### `@curiousdev-oss/perf/img-requires-dimensions`

Requires dimensions on images to prevent Cumulative Layout Shift (CLS).

```html
<!-- ❌ Bad - causes layout shifts -->
<img src="photo.jpg" alt="Photo" />

<!-- ✅ Good - explicit dimensions -->
<img src="photo.jpg" alt="Photo" width="300" height="200" />
<img src="photo.jpg" alt="Photo" style="width: 300px; height: 200px;" />

<!-- Angular templates -->
<img [src]="photoUrl" width="300" height="200" />
```

#### Loop and Algorithm Performance

##### `@curiousdev-oss/perf/no-inefficient-loops`

Prevents performance-damaging patterns inside loops.

```javascript
// ❌ Bad - expensive operations in loops
for (let i = 0; i < items.length; i++) {
  const element = document.querySelector(`#item-${i}`); // DOM query in loop
  const processed = JSON.parse(items[i]); // Parsing in loop
  console.log(processed); // Console in loop
}

// ✅ Good - cache outside loops
const elements = items.map((_, i) => document.querySelector(`#item-${i}`));
const processed = items.map((item) => JSON.parse(item));
for (let i = 0; i < items.length; i++) {
  // Use cached results
}
```

##### `@curiousdev-oss/perf/prefer-efficient-data-structures`

Suggests better algorithms and data structures.

```javascript
// ❌ Bad - inefficient patterns
if (array.indexOf(item) !== -1) {
} // Use Set.has() or Array.includes()
if (array.find((x) => x.id === id)) {
} // Use Array.some() for existence
array.filter(condition).length > 0; // Use Array.some()

// ❌ Bad - nested array operations
items
  .map(
    (item) => item.tags.filter((tag) => tag.active) // Creates intermediate arrays
  )
  .flat();

// ✅ Good - efficient alternatives
const itemSet = new Set(items);
if (itemSet.has(item)) {
}

if (array.some((x) => x.id === id)) {
}

// Single-pass operations
const result = items.flatMap((item) => item.tags.filter((tag) => tag.active));
```

#### DOM and Memory Performance

##### `@curiousdev-oss/perf/no-expensive-dom-operations`

Prevents DOM operations that trigger layout reflows.

```javascript
// ❌ Bad - triggers reflow/repaint
for (let element of elements) {
  element.style.width = "100px"; // Style changes in loop
  const height = element.offsetHeight; // Layout read in loop
}

// ✅ Good - batch DOM operations
elements.forEach((el) => el.classList.add("new-style")); // CSS class changes
const heights = elements.map((el) => el.getBoundingClientRect().height);
```

##### `@curiousdev-oss/perf/no-memory-leaks`

Prevents common memory leak patterns.

```javascript
// ❌ Bad - potential memory leaks
setInterval(() => updateData(), 1000);           // No clearInterval
element.addEventListener('click', handler);      // No removeEventListener
this.subscription = observable.subscribe(...);  // Angular: no unsubscribe

// ✅ Good - proper cleanup
const interval = setInterval(() => updateData(), 1000);
// Clear on cleanup: clearInterval(interval);

const controller = new AbortController();
element.addEventListener('click', handler, { signal: controller.signal });
// Cleanup: controller.abort();

// Angular component
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

##### `@curiousdev-oss/perf/prefer-lazy-loading`

Encourages lazy loading for better initial performance.

```html
<!-- ❌ Missing lazy loading -->
<img src="large-image.jpg" alt="Large image" />

<!-- ✅ Good - lazy loading -->
<img src="large-image.jpg" alt="Large image" loading="lazy" />

<!-- Angular lazy loading -->
<img [src]="imageUrl" loading="lazy" />
```

```javascript
// ❌ Bad - heavy library loaded immediately
import chartjs from "chart.js";

// ✅ Good - dynamic import for heavy libraries
const chartjs = await import("chart.js");
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm 8+

### Commands

```bash
# Install dependencies for all packages
npm install --workspaces

# Build the ESLint plugin
npm run build

# Run tests
npm test

# Test with sample applications
npm run test:eslint
```

### Repository Structure

```
web-perf-toolkit/
├── packages/
│   └── eslint-plugin-perf/       # ESLint performance rules
│       ├── src/
│       │   ├── index.ts         # Plugin entry point
│       │   └── rules/           # Individual rule implementations
│       ├── dist/                # Built files
│       └── package.json
├── test-apps/                   # Sample applications for testing
│   ├── ts-sample/              # TypeScript test application
│   ├── angular-sample/         # Angular test application
│   └── js-sample/              # JavaScript test application
├── package.json                # Root workspace config
├── tsconfig.json               # TypeScript project references
└── dev-guide.md               # This file
```

### Building

The project uses TypeScript project references for efficient builds:

- Root `tsconfig.json` defines project references
- The package has its own `tsconfig.json` extending root config
- `npm run build` builds the package with proper TypeScript compilation

### Testing

The package uses Jest with ts-jest for TypeScript support:

- Tests are co-located with source files (`*.test.ts`)
- Jest configured to pass with no tests (`passWithNoTests: true`)
- Run `npm test` to test the package
- Use `npm run test:eslint` to test against sample applications

## Contributing

### Adding New Rules to eslint-plugin-perf

1. Create rule file in `packages/eslint-plugin-perf/src/rules/`
2. Implement rule following ESLint rule format
3. Export rule from `packages/eslint-plugin-perf/src/index.ts`
4. Add to recommended config
5. Add tests and documentation
6. Update sample applications to include test cases

### Rule Development Guidelines

- Focus on performance impact rather than code style
- Provide clear, actionable error messages
- Include fix suggestions when possible
- Test against real-world code patterns
- Document the performance benefit of following the rule

## Testing Strategy

The project includes comprehensive testing through sample applications:

- **TypeScript Sample**: Tests general performance patterns
- **Angular Sample**: Tests framework-specific optimizations
- **JavaScript Sample**: Tests vanilla JavaScript patterns

Each sample application intentionally includes performance anti-patterns to verify rule detection.

## License

MIT - see package.json for details.