import type { Rule } from "eslint";

const _WEB_VITALS_PATTERNS = {
  // Largest Contentful Paint (LCP) optimizations
  LCP: {
    patterns: ["img", "video", "background-image", "text-block", "hero-image"],
    optimizations: [
      "Add loading='eager' to above-the-fold images",
      "Preload hero images and fonts",
      "Optimize image formats (WebP, AVIF)",
      "Use responsive images with srcset",
    ],
  },

  // First Input Delay (FID) optimizations
  FID: {
    patterns: [
      "event-listener",
      "click-handler",
      "input-handler",
      "scroll-handler",
    ],
    optimizations: [
      "Use passive event listeners",
      "Debounce expensive operations",
      "Defer non-critical JavaScript",
      "Code-split large event handlers",
    ],
  },

  // Cumulative Layout Shift (CLS) optimizations
  CLS: {
    patterns: [
      "dynamic-content",
      "font-loading",
      "image-dimensions",
      "placeholder",
    ],
    optimizations: [
      "Reserve space for dynamic content",
      "Use font-display: swap",
      "Set image dimensions",
      "Use skeleton loaders",
    ],
  },
};

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce Core Web Vitals optimizations for better Lighthouse performance scores",
    },
    schema: [],
  },
  create(context) {
    function checkImageOptimizations(node: any, attributes: any[]) {
      const attrs = new Map<string, any>();
      for (const attr of attributes || []) {
        if (attr.name) {
          attrs.set(attr.name, attr);
        }
      }

      const hasSrc = attrs.has("src");
      const hasLoading = attrs.has("loading");
      const hasWidth = attrs.has("width");
      const hasHeight = attrs.has("height");
      const hasSrcSet = attrs.has("srcset");
      const hasAlt = attrs.has("alt");

      if (hasSrc) {
        // LCP: Above-the-fold images should have loading="eager"
        if (!hasLoading) {
          context.report({
            node,
            message:
              "Add loading attribute (loading='lazy' for below-the-fold, loading='eager' for above-the-fold) to optimize LCP",
          });
        }

        // CLS: Images should have dimensions
        if (!hasWidth || !hasHeight) {
          context.report({
            node,
            message:
              "Set width and height attributes to prevent Cumulative Layout Shift (CLS)",
          });
        }

        // LCP: Use responsive images for better performance
        if (!hasSrcSet) {
          context.report({
            node,
            message:
              "Consider using srcset for responsive images to improve LCP on different device sizes",
          });
        }

        // Accessibility and SEO (affects Lighthouse score)
        if (!hasAlt) {
          context.report({
            node,
            message:
              "Add alt attribute for accessibility and better Lighthouse score",
          });
        }
      }
    }

    function checkFontOptimizations(node: any) {
      const source = context.getSourceCode().getText(node);

      // Check for font loading without font-display
      if (source.includes("@font-face") && !source.includes("font-display")) {
        context.report({
          node,
          message:
            "Add font-display: swap to @font-face to improve CLS and LCP",
        });
      }

      // Check for web font imports without optimization
      if (
        source.includes("fonts.googleapis.com") ||
        source.includes("@import")
      ) {
        if (!source.includes("display=swap")) {
          context.report({
            node,
            message:
              "Add &display=swap to Google Fonts URLs to optimize font loading",
          });
        }
      }
    }

    function checkEventListenerOptimizations(node: any) {
      if (
        node.callee?.type === "MemberExpression" &&
        node.callee.property?.name === "addEventListener"
      ) {
        const args = node.arguments;
        if (args?.length >= 2) {
          const eventType = args[0];
          const options = args[2];

          // Check for passive event listeners on scroll/touch events
          if (eventType?.type === "Literal") {
            const event = eventType.value;
            const passiveEvents = [
              "scroll",
              "touchstart",
              "touchmove",
              "wheel",
            ];

            if (passiveEvents.includes(event)) {
              const hasPassive =
                options?.type === "ObjectExpression" &&
                options.properties?.some(
                  (prop: any) =>
                    prop.key?.name === "passive" && prop.value?.value === true
                );

              if (!hasPassive) {
                context.report({
                  node,
                  message: `Add { passive: true } to '${event}' event listener to improve FID performance`,
                });
              }
            }
          }
        }
      }
    }

    function checkAsyncOperations(node: any) {
      // Check for synchronous operations that should be async
      if (node.callee?.type === "MemberExpression") {
        const obj = node.callee.object;
        const _prop = node.callee.property;

        // Main thread blocking operations
        const blockingOps = [
          "localStorage",
          "sessionStorage",
          "document.cookie",
        ];

        if (obj?.name && blockingOps.includes(obj.name)) {
          context.report({
            node,
            message: `Synchronous ${obj.name} operations can hurt FID. Consider async alternatives or caching`,
          });
        }
      }
    }

    function checkPreloadHints(node: any) {
      const source = context.getSourceCode().getText(node);

      // Look for resource hints in template literals
      if (source.includes("<link")) {
        const hasPreload = source.includes('rel="preload"');
        const _hasPrefetch = source.includes('rel="prefetch"');
        const _hasDnsPrefetch = source.includes('rel="dns-prefetch"');

        // Check for missing preload hints for critical resources
        if (source.includes('href="') && source.includes(".woff")) {
          if (!hasPreload) {
            context.report({
              node,
              message:
                "Preload critical fonts with <link rel='preload'> to improve LCP",
            });
          }
        }

        if (
          source.includes('src="') &&
          (source.includes(".jpg") ||
            source.includes(".png") ||
            source.includes(".webp"))
        ) {
          if (
            !hasPreload &&
            (source.includes("hero") || source.includes("banner"))
          ) {
            context.report({
              node,
              message:
                "Preload hero/banner images with <link rel='preload'> to improve LCP",
            });
          }
        }
      }
    }

    return {
      // JSX image optimization
      JSXOpeningElement(node: any) {
        if (node.name?.type === "JSXIdentifier") {
          const tagName = node.name.name;

          if (tagName === "img") {
            const attrs =
              node.attributes?.map((a: any) => ({
                name: a.name?.name,
                value: a.value,
              })) || [];
            checkImageOptimizations(node, attrs);
          }

          // Check for div with background images (potential LCP elements)
          if (tagName === "div") {
            const styleAttr = node.attributes?.find(
              (a: any) => a.name?.name === "style"
            );
            if (styleAttr) {
              const styleValue = context.getSourceCode().getText(styleAttr);
              if (styleValue.includes("background-image")) {
                context.report({
                  node,
                  message:
                    "Background images on divs can hurt LCP. Consider using <img> with object-fit for better optimization",
                });
              }
            }
          }
        }
      },

      // Template literal optimizations
      TemplateLiteral(node: any) {
        checkFontOptimizations(node);
        checkPreloadHints(node);

        const source = context.getSourceCode().getText(node);

        // Check for images in templates
        const imgMatches = source.match(/<img[^>]*>/g);
        if (imgMatches) {
          imgMatches.forEach(() => {
            // Basic check for common issues
            if (!source.includes("loading=")) {
              context.report({
                node,
                message:
                  "Add loading attribute to images in templates for LCP optimization",
              });
            }

            if (!source.includes("width=") || !source.includes("height=")) {
              context.report({
                node,
                message: "Set image dimensions in templates to prevent CLS",
              });
            }
          });
        }
      },

      // Event listener optimizations
      CallExpression(node: any) {
        checkEventListenerOptimizations(node);
        checkAsyncOperations(node);

        // Check for setTimeout/setInterval that might hurt performance
        if (
          node.callee?.name === "setTimeout" ||
          node.callee?.name === "setInterval"
        ) {
          const delay = node.arguments?.[1];
          if (delay?.type === "Literal" && typeof delay.value === "number") {
            if (delay.value < 16) {
              context.report({
                node,
                message: `${node.callee.name} with ${delay.value}ms delay can hurt performance. Use requestAnimationFrame for smooth animations`,
              });
            }
          }
        }
      },

      // CSS optimizations in style tags
      Literal(node: any) {
        if (
          typeof node.value === "string" &&
          node.value.includes("@font-face")
        ) {
          checkFontOptimizations(node);
        }
      },

      // Import optimizations for Web Vitals
      ImportDeclaration(node: any) {
        const source = node.source?.value as string;
        if (!source) return;

        // Suggest web-vitals library for monitoring
        if (source.includes("performance") || source.includes("analytics")) {
          context.report({
            node,
            message:
              "Consider importing 'web-vitals' library to monitor Core Web Vitals in production",
          });
        }
      },
    };
  },
};

export default rule;
