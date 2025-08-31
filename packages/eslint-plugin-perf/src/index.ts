import type { Linter, Rule } from "eslint";
import imgRequiresDimensions from "./rules/img-requires-dimensions.js";
import noHeavyNamespaceImports from "./rules/no-heavy-namespace-imports.js";
import noBlockingApis from "./rules/no-blocking-apis.js";
import noInefficientLoops from "./rules/no-inefficient-loops.js";
import preferLazyLoading from "./rules/prefer-lazy-loading.js";
import noMemoryLeaks from "./rules/no-memory-leaks.js";
import noExpensiveDomOperations from "./rules/no-expensive-dom-operations.js";
import preferEfficientDataStructures from "./rules/prefer-efficient-data-structures.js";
import noSyncApisInRender from "./rules/no-sync-apis-in-render.js";
import preferModernApis from "./rules/prefer-modern-apis.js";
import noLargeBundleImports from "./rules/no-large-bundle-imports.js";
import preferWebVitalsOptimizations from "./rules/prefer-web-vitals-optimizations.js";
import noRenderBlockingResources from "./rules/no-render-blocking-resources.js";
import preferResourceHints from "./rules/prefer-resource-hints.js";

export const rules: Record<string, Rule.RuleModule> = {
  "img-requires-dimensions": imgRequiresDimensions,
  "no-heavy-namespace-imports": noHeavyNamespaceImports,
  "no-blocking-apis": noBlockingApis,
  "no-inefficient-loops": noInefficientLoops,
  "prefer-lazy-loading": preferLazyLoading,
  "no-memory-leaks": noMemoryLeaks,
  "no-expensive-dom-operations": noExpensiveDomOperations,
  "prefer-efficient-data-structures": preferEfficientDataStructures,
  "no-sync-apis-in-render": noSyncApisInRender,
  "prefer-modern-apis": preferModernApis,
  "no-large-bundle-imports": noLargeBundleImports,
  "prefer-web-vitals-optimizations": preferWebVitalsOptimizations,
  "no-render-blocking-resources": noRenderBlockingResources,
  "prefer-resource-hints": preferResourceHints,
};

export const configs: Record<string, Linter.Config> = {
  recommended: {
    plugins: ["@web-perf-toolkit/perf"],
    rules: {
      "@web-perf-toolkit/perf/img-requires-dimensions": "error",
      "@web-perf-toolkit/perf/no-heavy-namespace-imports": [
        "error",
        { deny: ["lodash", "moment", "rxjs", "date-fns"] },
      ],
      "@web-perf-toolkit/perf/no-blocking-apis": "warn",
      "@web-perf-toolkit/perf/no-inefficient-loops": "error",
      "@web-perf-toolkit/perf/prefer-lazy-loading": "warn",
      "@web-perf-toolkit/perf/no-memory-leaks": "error",
      "@web-perf-toolkit/perf/no-expensive-dom-operations": "warn",
      "@web-perf-toolkit/perf/prefer-efficient-data-structures": "warn",
      "@web-perf-toolkit/perf/no-sync-apis-in-render": "error",
      "@web-perf-toolkit/perf/prefer-modern-apis": "warn",
      "@web-perf-toolkit/perf/no-large-bundle-imports": "warn",
      "@web-perf-toolkit/perf/prefer-web-vitals-optimizations": "warn",
      "@web-perf-toolkit/perf/no-render-blocking-resources": "error",
      "@web-perf-toolkit/perf/prefer-resource-hints": "warn",
    },
  },
  strict: {
    plugins: ["@web-perf-toolkit/perf"],
    rules: {
      "@web-perf-toolkit/perf/img-requires-dimensions": "error",
      "@web-perf-toolkit/perf/no-heavy-namespace-imports": [
        "error",
        { deny: ["lodash", "moment", "rxjs", "date-fns", "chart.js", "d3"] },
      ],
      "@web-perf-toolkit/perf/no-blocking-apis": "error",
      "@web-perf-toolkit/perf/no-inefficient-loops": "error",
      "@web-perf-toolkit/perf/prefer-lazy-loading": "error",
      "@web-perf-toolkit/perf/no-memory-leaks": "error",
      "@web-perf-toolkit/perf/no-expensive-dom-operations": "error",
      "@web-perf-toolkit/perf/prefer-efficient-data-structures": "error",
      "@web-perf-toolkit/perf/no-sync-apis-in-render": "error",
      "@web-perf-toolkit/perf/prefer-modern-apis": "error",
      "@web-perf-toolkit/perf/no-large-bundle-imports": "error",
      "@web-perf-toolkit/perf/prefer-web-vitals-optimizations": "error",
      "@web-perf-toolkit/perf/no-render-blocking-resources": "error",
      "@web-perf-toolkit/perf/prefer-resource-hints": "error",
    },
  },
  angular: {
    plugins: ["@web-perf-toolkit/perf"],
    rules: {
      "@web-perf-toolkit/perf/img-requires-dimensions": "error",
      "@web-perf-toolkit/perf/no-heavy-namespace-imports": [
        "error",
        { deny: ["lodash", "moment", "rxjs"] },
      ],
      "@web-perf-toolkit/perf/no-blocking-apis": "warn",
      "@web-perf-toolkit/perf/no-inefficient-loops": "error",
      "@web-perf-toolkit/perf/prefer-lazy-loading": "warn",
      "@web-perf-toolkit/perf/no-memory-leaks": "error", // Especially important for Angular
      "@web-perf-toolkit/perf/no-expensive-dom-operations": "warn",
      "@web-perf-toolkit/perf/prefer-efficient-data-structures": "warn",
      "@web-perf-toolkit/perf/no-sync-apis-in-render": "error", // Critical for Angular lifecycle
      "@web-perf-toolkit/perf/prefer-modern-apis": "warn",
      "@web-perf-toolkit/perf/no-large-bundle-imports": [
        "warn",
        { maxSize: 75, allowedLarge: ["@angular/core", "@angular/common"] },
      ],
      "@web-perf-toolkit/perf/prefer-web-vitals-optimizations": "error",
      "@web-perf-toolkit/perf/no-render-blocking-resources": "warn",
      "@web-perf-toolkit/perf/prefer-resource-hints": "warn",
    },
  },
};

export default { rules, configs };
