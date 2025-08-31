import type { Rule } from "eslint";

const RENDER_BLOCKING_PATTERNS = {
  CSS: [
    "import './styles.css'",
    "import '../styles/",
    'rel="stylesheet"',
    "@import url(",
  ],
  JS: ['type="text/javascript"', "<script src=", "import()"],
  FONTS: [
    "fonts.googleapis.com",
    "@font-face",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
  ],
};

const BLOCKING_SCRIPT_PATTERNS = [
  "document.write",
  "document.writeln",
  "eval(",
  "new Function(",
  "setTimeout(eval",
  "setInterval(eval",
];

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Prevent render-blocking resources that hurt First Contentful Paint and Largest Contentful Paint",
    },
    schema: [],
  },
  create(context) {
    function checkRenderBlockingCSS(node: any) {
      const source = context.getSourceCode().getText(node);

      // Check for synchronous CSS imports
      if (source.includes("import") && source.includes(".css")) {
        context.report({
          node,
          message:
            "CSS imports can block rendering. Consider using CSS-in-JS, dynamic imports, or ensuring critical CSS is inlined",
        });
      }

      // Check for blocking stylesheets in templates
      if (source.includes("<link") && source.includes('rel="stylesheet"')) {
        if (!source.includes("media=") && !source.includes("disabled")) {
          context.report({
            node,
            message:
              "Stylesheet links without media queries block rendering. Consider using media='print' onload pattern or critical CSS",
          });
        }
      }

      // Check for @import in CSS
      if (source.includes("@import")) {
        context.report({
          node,
          message:
            "@import statements block rendering. Use bundler imports or <link> tags instead",
        });
      }
    }

    function checkRenderBlockingFonts(node: any) {
      const source = context.getSourceCode().getText(node);

      // Check for Google Fonts without optimization
      if (source.includes("fonts.googleapis.com")) {
        if (
          !source.includes("display=swap") &&
          !source.includes("font-display: swap")
        ) {
          context.report({
            node,
            message:
              "Google Fonts without display=swap block rendering. Add &display=swap to the URL or font-display: swap to CSS",
          });
        }

        if (!source.includes("rel=preconnect")) {
          context.report({
            node,
            message:
              "Add <link rel='preconnect' href='https://fonts.googleapis.com'> to reduce font loading delays",
          });
        }
      }

      // Check for @font-face without font-display
      if (source.includes("@font-face") && !source.includes("font-display")) {
        context.report({
          node,
          message:
            "Add font-display: swap to @font-face to prevent invisible text during font swap",
        });
      }
    }

    function checkRenderBlockingScripts(node: any) {
      const source = context.getSourceCode().getText(node);

      // Check for render-blocking script patterns
      BLOCKING_SCRIPT_PATTERNS.forEach((pattern) => {
        if (source.includes(pattern)) {
          context.report({
            node,
            message: `'${pattern}' blocks rendering and parsing. Avoid or defer this operation`,
          });
        }
      });

      // Check for scripts without async/defer
      if (
        source.includes("<script src=") &&
        !source.includes("async") &&
        !source.includes("defer")
      ) {
        context.report({
          node,
          message:
            "External scripts without async/defer block rendering. Add async for third-party scripts or defer for your scripts",
        });
      }

      // Check for inline scripts that might be large
      const scriptMatches = source.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
      if (scriptMatches) {
        scriptMatches.forEach((script) => {
          if (script.length > 500) {
            // Arbitrary threshold
            context.report({
              node,
              message:
                "Large inline scripts block rendering. Consider moving to external files with async/defer",
            });
          }
        });
      }
    }

    return {
      // Import statements
      ImportDeclaration(node: any) {
        const source = node.source?.value as string;
        if (!source) return;

        // Check for CSS imports
        if (
          source.endsWith(".css") ||
          source.includes("/styles/") ||
          source.includes(".scss") ||
          source.includes(".less")
        ) {
          context.report({
            node,
            message: `CSS import '${source}' may block rendering. Consider code-splitting CSS or using CSS-in-JS for critical styles`,
          });
        }

        // Check for large library imports that should be dynamic
        const heavyLibraries = [
          "three",
          "chart.js",
          "d3",
          "monaco-editor",
          "pdf-lib",
          "fabric",
        ];

        const isHeavyLibrary = heavyLibraries.some((lib) =>
          source.includes(lib)
        );
        if (isHeavyLibrary) {
          context.report({
            node,
            message: `Heavy library '${source}' may block rendering. Consider dynamic import() to load on-demand`,
          });
        }
      },

      // Template literals with HTML
      TemplateLiteral(node: any) {
        checkRenderBlockingCSS(node);
        checkRenderBlockingFonts(node);
        checkRenderBlockingScripts(node);
      },

      // String literals that might contain HTML/CSS
      Literal(node: any) {
        if (typeof node.value === "string") {
          checkRenderBlockingCSS(node);
          checkRenderBlockingFonts(node);
          checkRenderBlockingScripts(node);
        }
      },

      // Function calls that might block rendering
      CallExpression(node: any) {
        // Check for document.write family
        if (node.callee?.type === "MemberExpression") {
          const obj = node.callee.object;
          const prop = node.callee.property;

          if (obj?.name === "document" && prop?.name) {
            if (["write", "writeln"].includes(prop.name)) {
              context.report({
                node,
                message: `document.${prop.name}() blocks HTML parsing. Use modern DOM manipulation methods`,
              });
            }
          }
        }

        // Check for eval and Function constructor
        if (node.callee?.name === "eval") {
          context.report({
            node,
            message:
              "eval() blocks JavaScript parsing and execution. Avoid or use JSON.parse for safe parsing",
          });
        }

        if (node.callee?.name === "Function" && node.arguments?.length > 0) {
          context.report({
            node,
            message:
              "Function constructor blocks execution. Use regular functions or arrow functions",
          });
        }

        // Check for synchronous XHR
        if (
          node.callee?.type === "MemberExpression" &&
          node.callee.property?.name === "open" &&
          node.arguments?.length >= 3 &&
          node.arguments[2]?.value === false
        ) {
          context.report({
            node,
            message:
              "Synchronous XMLHttpRequest blocks the main thread. Use async requests or fetch()",
          });
        }
      },

      // JSX elements
      JSXOpeningElement(node: any) {
        if (node.name?.type === "JSXIdentifier") {
          const tagName = node.name.name;

          // Check for link tags
          if (tagName === "link") {
            const relAttr = node.attributes?.find(
              (a: any) => a.name?.name === "rel"
            );
            const mediaAttr = node.attributes?.find(
              (a: any) => a.name?.name === "media"
            );

            if (relAttr?.value?.value === "stylesheet" && !mediaAttr) {
              context.report({
                node,
                message:
                  "Stylesheet <link> without media attribute blocks rendering. Add media='all' or specific media query",
              });
            }
          }

          // Check for script tags
          if (tagName === "script") {
            const srcAttr = node.attributes?.find(
              (a: any) => a.name?.name === "src"
            );
            const asyncAttr = node.attributes?.find(
              (a: any) => a.name?.name === "async"
            );
            const deferAttr = node.attributes?.find(
              (a: any) => a.name?.name === "defer"
            );

            if (srcAttr && !asyncAttr && !deferAttr) {
              context.report({
                node,
                message:
                  "External <script> without async/defer blocks rendering. Add async or defer attribute",
              });
            }
          }
        }
      },

      // Check for CSS-in-JS patterns that might block
      Property(node: any) {
        if (
          node.key?.name === "style" &&
          node.value?.type === "ObjectExpression"
        ) {
          // Large style objects might indicate performance issues
          if (node.value.properties?.length > 20) {
            context.report({
              node,
              message:
                "Large inline style objects can hurt performance. Consider CSS classes or styled-components",
            });
          }
        }
      },
    };
  },
};

export default rule;
