import type { Rule } from "eslint";

const LEGACY_API_REPLACEMENTS = new Map([
  // DOM APIs
  ["document.getElementById", "document.querySelector with better caching"],
  ["document.getElementsByClassName", "document.querySelectorAll"],
  ["document.getElementsByTagName", "document.querySelectorAll"],
  ["document.createElement", "Use modern DOM manipulation or frameworks"],
  ["XMLHttpRequest", "fetch() API"],

  // Array methods (for IE compatibility)
  ["Array.prototype.forEach", "Use for...of loops for better performance"],

  // Date methods
  ["Date", "Use modern date libraries like date-fns or native Intl"],
  ["new Date().getTime()", "Date.now()"],

  // String methods
  ["String.prototype.substr", "String.prototype.substring or slice"],

  // Event handling
  ["attachEvent", "addEventListener"],
  ["detachEvent", "removeEventListener"],

  // CSS
  ["element.style.cssText", "element.style property assignment or CSS classes"],

  // Storage
  ["document.cookie", "Use modern storage APIs or libraries"],
]);

const MODERN_ALTERNATIVES = new Map([
  ["setTimeout", "Use requestAnimationFrame for animations"],
  ["setInterval", "Use requestAnimationFrame for smooth animations"],
  ["console.log", "Use proper logging libraries in production"],
]);

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Encourage modern web APIs over legacy ones for better performance and compatibility",
    },
    schema: [],
    fixable: "code",
  },
  create(context) {
    function checkLegacyAPI(node: any, apiName: string) {
      const suggestion = LEGACY_API_REPLACEMENTS.get(apiName);
      if (suggestion) {
        context.report({
          node,
          message: `Legacy API '${apiName}' detected. ${suggestion} for better performance.`,
        });
      }
    }

    function checkModernAlternative(node: any, apiName: string) {
      const suggestion = MODERN_ALTERNATIVES.get(apiName);
      if (suggestion) {
        context.report({
          node,
          message: `Consider modern alternative: ${suggestion}`,
        });
      }
    }

    return {
      MemberExpression(node: any) {
        const obj = node.object;
        const prop = node.property;

        if (!obj || !prop?.name) return;

        // Check for document methods
        if (obj.name === "document") {
          const apiName = `document.${prop.name}`;
          checkLegacyAPI(node, apiName);
        }

        // Check for XMLHttpRequest
        if (obj.name === "XMLHttpRequest") {
          checkLegacyAPI(node, "XMLHttpRequest");
        }

        // Check for legacy string methods
        if (prop.name === "substr") {
          checkLegacyAPI(node, "String.prototype.substr");
        }

        // Check for element.style.cssText
        if (
          obj.type === "MemberExpression" &&
          obj.property?.name === "style" &&
          prop.name === "cssText"
        ) {
          checkLegacyAPI(node, "element.style.cssText");
        }

        // Check for Date().getTime()
        if (
          obj.type === "NewExpression" &&
          obj.callee?.name === "Date" &&
          prop.name === "getTime"
        ) {
          checkLegacyAPI(node, "new Date().getTime()");
        }
      },

      CallExpression(node: any) {
        const callee = node.callee;

        // Check for global functions
        if (callee?.name === "setTimeout" && node.arguments?.length >= 1) {
          // Check if it's being used for animation (short intervals)
          const delay = node.arguments[1];
          if (
            delay?.type === "Literal" &&
            typeof delay.value === "number" &&
            delay.value <= 50
          ) {
            checkModernAlternative(node, "setTimeout");
          }
        }

        if (callee?.name === "setInterval") {
          checkModernAlternative(node, "setInterval");
        }

        // Check for legacy event methods
        if (callee?.type === "MemberExpression") {
          const _obj = callee.object;
          const prop = callee.property;

          if (prop?.name === "attachEvent") {
            checkLegacyAPI(node, "attachEvent");
          }

          if (prop?.name === "detachEvent") {
            checkLegacyAPI(node, "detachEvent");
          }
        }
      },

      NewExpression(node: any) {
        // Check for XMLHttpRequest constructor
        if (node.callee?.name === "XMLHttpRequest") {
          checkLegacyAPI(node, "XMLHttpRequest");
        }

        // Check for Date constructor usage that could be optimized
        if (node.callee?.name === "Date" && node.arguments?.length === 0) {
          context.report({
            node,
            message:
              "Use Date.now() instead of new Date() for timestamps - it's faster",
            fix(fixer: any) {
              return fixer.replaceText(node, "Date.now()");
            },
          });
        }
      },

      // Check for feature detection patterns that suggest legacy support
      BinaryExpression(node: any) {
        // typeof XMLHttpRequest !== 'undefined'
        if (
          node.operator === "!==" &&
          node.left?.type === "UnaryExpression" &&
          node.left.operator === "typeof" &&
          node.left.argument?.name === "XMLHttpRequest"
        ) {
          context.report({
            node,
            message:
              "XMLHttpRequest feature detection suggests legacy code. Consider using fetch() with polyfills.",
          });
        }

        // typeof fetch === 'undefined'
        if (
          node.operator === "===" &&
          node.left?.type === "UnaryExpression" &&
          node.left.operator === "typeof" &&
          node.left.argument?.name === "fetch" &&
          node.right?.value === "undefined"
        ) {
          context.report({
            node,
            message:
              "Fetch feature detection found. Ensure you're using modern bundling with polyfills.",
          });
        }
      },

      // Check for polyfill imports that might not be needed
      ImportDeclaration(node: any) {
        const source = node.source?.value as string;
        if (!source) return;

        const polyfillPatterns = [
          "core-js",
          "babel-polyfill",
          "es6-promise",
          "whatwg-fetch",
          "intersection-observer",
        ];

        const isPolyfill = polyfillPatterns.some((pattern) =>
          source.includes(pattern)
        );

        if (isPolyfill) {
          context.report({
            node,
            message: `Polyfill '${source}' detected. Verify it's still needed for your target browsers to avoid unnecessary bundle bloat.`,
          });
        }
      },
    };
  },
};

export default rule;
