# ESLint Performance Plugin Test Applications

This directory contains sample applications to test and demonstrate the `@curiousdev-oss/eslint-plugin-web-perf` rules in action.

> **📦 Note**: These test apps use the published npm package (`^0.1.2`) rather than local file references, providing a realistic testing environment.

## Sample Applications

### 1. JavaScript Sample (`js-sample/`)

- **Configuration**: Uses `recommended` config
- **Framework**: Vanilla JavaScript
- **Purpose**: Tests basic performance rules without framework specifics

**Run tests:**

```bash
cd js-sample
npm install
npm run lint
```

**Expected Results**: 45+ problems (varies by configuration)

### 2. TypeScript Sample (`ts-sample/`)

- **Configuration**: Uses `strict` config
- **Framework**: TypeScript with type checking
- **Purpose**: Tests performance rules with stricter enforcement

**Run tests:**

```bash
cd ts-sample
npm install
npm run lint
```

**Expected Results**: 72+ problems (detected by comprehensive rules)

### 3. Angular Sample (`angular-sample/`)

- **Configuration**: Uses `angular` config
- **Framework**: Angular with component patterns
- **Purpose**: Tests Angular-specific patterns (subscriptions, lifecycle hooks)

**Run tests:**

```bash
cd angular-sample
npm install
npm run lint
```

**Expected Results**: 80+ problems (Angular-specific patterns detected)

## Rules Being Tested

All sample apps contain intentional performance issues to trigger these rules:

### Core Performance Rules

- ✅ `no-heavy-namespace-imports`: Catches `import * as` from heavy libraries
- ✅ `no-blocking-apis`: Catches sync APIs like `localStorage`, `JSON.parse`, `alert`
- ✅ `img-requires-dimensions`: Requires dimensions on images to prevent CLS

### Loop and Algorithm Performance

- ✅ `no-inefficient-loops`: Catches DOM queries, JSON parsing, console in loops
- ✅ `prefer-efficient-data-structures`: Suggests better algorithms and data structures

### DOM and Memory Performance

- ✅ `no-expensive-dom-operations`: Catches layout-triggering operations in loops
- ✅ `no-memory-leaks`: Catches intervals, event listeners, subscriptions without cleanup
- ✅ `prefer-lazy-loading`: Suggests lazy loading for images and heavy modules

## Performance Issues Demonstrated

### Heavy Imports

```javascript
// ❌ Flagged by no-heavy-namespace-imports
import * as _ from "lodash"; // Imports 70KB
import * as moment from "moment"; // Imports 60KB
import * as rxjs from "rxjs"; // Heavy RxJS import

// ✅ Better
import { debounce } from "lodash";
import { format } from "date-fns"; // Lighter alternative
```

### Blocking APIs

```javascript
// ❌ Flagged by no-blocking-apis
const data = localStorage.getItem("user"); // Blocks main thread
const parsed = JSON.parse(largeData); // Sync parsing
alert("Message"); // Blocking modal

// ✅ Better
const data = await asyncStorage.getItem("user");
const parsed = await streamParser.parse(largeData);
showToast("Message"); // Non-blocking
```

### Loop Performance

```javascript
// ❌ Flagged by no-inefficient-loops
for (const item of items) {
  const element = document.querySelector(`#${item.id}`); // DOM query in loop
  const data = JSON.parse(item.data); // Parsing in loop
  console.log(data); // Console in loop
}

// ✅ Better - cache outside loop
const elements = items.map((item) => document.querySelector(`#${item.id}`));
const parsedData = items.map((item) => JSON.parse(item.data));
```

### Memory Leaks (Angular-specific)

```typescript
// ❌ Flagged by no-memory-leaks
ngOnInit() {
  setInterval(() => update(), 1000);           // No cleanup
  observable.subscribe(data => handle(data));  // No unsubscribe
}

// Empty ngOnDestroy - flagged
ngOnDestroy() { }

// ✅ Better
private subscription = new Subscription();

ngOnInit() {
  const interval = setInterval(() => update(), 1000);
  this.subscription.add(() => clearInterval(interval));

  this.subscription.add(
    observable.subscribe(data => handle(data))
  );
}

ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

### Layout Thrashing

```javascript
// ❌ Flagged by no-expensive-dom-operations
for (const element of elements) {
  element.style.width = "100px"; // Style change in loop
  const height = element.offsetHeight; // Layout read in loop
}

// ✅ Better - batch operations
elements.forEach((el) => el.classList.add("new-style"));
const heights = elements.map((el) => el.getBoundingClientRect().height);
```

## Configuration Examples

### Recommended Config (Balanced)

```javascript
import perf from "@curiousdev-oss/eslint-plugin-web-perf";

export default [
  {
    plugins: { "@curiousdev-oss/perf": perf },
    rules: { ...perf.configs.recommended.rules },
  },
];
```

### Strict Config (Performance-Critical)

```javascript
// All rules as errors for zero tolerance
export default [
  {
    plugins: { "@curiousdev-oss/perf": perf },
    rules: { ...perf.configs.strict.rules },
  },
];
```

### Angular Config (Framework-Optimized)

```javascript
// Optimized for Angular patterns
export default [
  {
    plugins: { "@curiousdev-oss/perf": perf },
    rules: { ...perf.configs.angular.rules },
  },
];
```

## Expected Output Summary

| Sample App | Total Problems | Key Patterns                |
| ---------- | -------------- | --------------------------- |
| JavaScript | 45+            | Basic performance patterns  |
| TypeScript | 72+            | Comprehensive rule coverage |
| Angular    | 80+            | Framework-specific patterns |

All sample apps successfully demonstrate the comprehensive performance rule coverage across different JavaScript/TypeScript environments.
