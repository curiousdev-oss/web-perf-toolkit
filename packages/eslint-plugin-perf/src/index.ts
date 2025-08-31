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
    plugins: ["@curiousdev-oss/perf"],
    rules: {
      "@curiousdev-oss/perf/img-requires-dimensions": "error",
      "@curiousdev-oss/perf/no-heavy-namespace-imports": [
        "error",
        { deny: ["lodash", "moment", "rxjs", "date-fns"] },
      ],
      "@curiousdev-oss/perf/no-blocking-apis": "warn",
      "@curiousdev-oss/perf/no-inefficient-loops": "error",
      "@curiousdev-oss/perf/prefer-lazy-loading": "warn",
      "@curiousdev-oss/perf/no-memory-leaks": "error",
      "@curiousdev-oss/perf/no-expensive-dom-operations": "warn",
      "@curiousdev-oss/perf/prefer-efficient-data-structures": "warn",
      "@curiousdev-oss/perf/no-sync-apis-in-render": "error",
      "@curiousdev-oss/perf/prefer-modern-apis": "warn",
      "@curiousdev-oss/perf/no-large-bundle-imports": "warn",
      "@curiousdev-oss/perf/prefer-web-vitals-optimizations": "warn",
      "@curiousdev-oss/perf/no-render-blocking-resources": "error",
      "@curiousdev-oss/perf/prefer-resource-hints": "warn",
    },
  },
  strict: {
    plugins: ["@curiousdev-oss/perf"],
    rules: {
      "@curiousdev-oss/perf/img-requires-dimensions": "error",
      "@curiousdev-oss/perf/no-heavy-namespace-imports": [
        "error",
        { deny: ["lodash", "moment", "rxjs", "date-fns", "chart.js", "d3"] },
      ],
      "@curiousdev-oss/perf/no-blocking-apis": "error",
      "@curiousdev-oss/perf/no-inefficient-loops": "error",
      "@curiousdev-oss/perf/prefer-lazy-loading": "error",
      "@curiousdev-oss/perf/no-memory-leaks": "error",
      "@curiousdev-oss/perf/no-expensive-dom-operations": "error",
      "@curiousdev-oss/perf/prefer-efficient-data-structures": "error",
      "@curiousdev-oss/perf/no-sync-apis-in-render": "error",
      "@curiousdev-oss/perf/prefer-modern-apis": "error",
      "@curiousdev-oss/perf/no-large-bundle-imports": "error",
      "@curiousdev-oss/perf/prefer-web-vitals-optimizations": "error",
      "@curiousdev-oss/perf/no-render-blocking-resources": "error",
      "@curiousdev-oss/perf/prefer-resource-hints": "error",
    },
  },
  angular: {
    plugins: ["@curiousdev-oss/perf"],
    rules: {
      "@curiousdev-oss/perf/img-requires-dimensions": "error",
      "@curiousdev-oss/perf/no-heavy-namespace-imports": [
        "error",
        { deny: ["lodash", "moment", "rxjs"] },
      ],
      "@curiousdev-oss/perf/no-blocking-apis": "warn",
      "@curiousdev-oss/perf/no-inefficient-loops": "error",
      "@curiousdev-oss/perf/prefer-lazy-loading": "warn",
      "@curiousdev-oss/perf/no-memory-leaks": "error", // Especially important for Angular
      "@curiousdev-oss/perf/no-expensive-dom-operations": "warn",
      "@curiousdev-oss/perf/prefer-efficient-data-structures": "warn",
      "@curiousdev-oss/perf/no-sync-apis-in-render": "error", // Critical for Angular lifecycle
      "@curiousdev-oss/perf/prefer-modern-apis": "warn",
      "@curiousdev-oss/perf/no-large-bundle-imports": [
        "warn",
        { maxSize: 75, allowedLarge: ["@angular/core", "@angular/common"] },
      ],
      "@curiousdev-oss/perf/prefer-web-vitals-optimizations": "error",
      "@curiousdev-oss/perf/no-render-blocking-resources": "warn",
      "@curiousdev-oss/perf/prefer-resource-hints": "warn",
    },
  },
};

export default { rules, configs };
