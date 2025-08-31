  import type { Rule } from "eslint";

const RESOURCE_HINT_TYPES = {
  PRELOAD: "preload", // Critical resources needed for initial render
  PREFETCH: "prefetch", // Resources likely needed for future navigation
  PRECONNECT: "preconnect", // Establish early connections to important origins
  DNS_PREFETCH: "dns-prefetch", // Resolve DNS for cross-origin resources
  MODULEPRELOAD: "modulepreload", // Preload ES modules
};

const CRITICAL_RESOURCE_PATTERNS = {
  fonts: [".woff2", ".woff", ".ttf", ".otf"],
  images: [".jpg", ".jpeg", ".png", ".webp", ".avif"],
  scripts: [".js", ".mjs", ".ts"],
  styles: [".css"],
  videos: [".mp4", ".webm", ".ogg"],
};

const EXTERNAL_DOMAINS = [
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "cdn.jsdelivr.net",
  "unpkg.com",
  "cdnjs.cloudflare.com",
  "ajax.googleapis.com",
  "maxcdn.bootstrapcdn.com",
];

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Encourage proper resource hints (preload, prefetch, preconnect) for better loading performance",
    },
    schema: [],
  },
  create(context) {
    const foundResources = new Set<string>();
    const foundHints = new Set<string>();

    function extractUrl(text: string): string[] {
      const urls: string[] = [];

      // Extract URLs from various patterns
      const patterns = [
        /src=["']([^"']+)["']/g,
        /href=["']([^"']+)["']/g,
        /url\(["']?([^"')]+)["']?\)/g,
        /import\s*\(\s*["']([^"']+)["']\s*\)/g,
        /from\s*["']([^"']+)["']/g,
      ];

      patterns.forEach((pattern) => {
        let match;
        while ((match = pattern.exec(text)) !== null) {
          urls.push(match[1]);
        }
      });

      return urls;
    }

    function getResourceType(url: string): string | null {
      const urlLower = url.toLowerCase();

      if (
        CRITICAL_RESOURCE_PATTERNS.fonts.some((ext) => urlLower.includes(ext))
      ) {
        return "font";
      }
      if (
        CRITICAL_RESOURCE_PATTERNS.images.some((ext) => urlLower.includes(ext))
      ) {
        return "image";
      }
      if (
        CRITICAL_RESOURCE_PATTERNS.scripts.some((ext) => urlLower.includes(ext))
      ) {
        return "script";
      }
      if (
        CRITICAL_RESOURCE_PATTERNS.styles.some((ext) => urlLower.includes(ext))
      ) {
        return "style";
      }
      if (
        CRITICAL_RESOURCE_PATTERNS.videos.some((ext) => urlLower.includes(ext))
      ) {
        return "video";
      }

      return null;
    }

    function isExternalDomain(url: string): boolean {
      return (
        EXTERNAL_DOMAINS.some((domain) => url.includes(domain)) ||
        url.startsWith("http://") ||
        url.startsWith("https://")
      );
    }

    function isCriticalResource(url: string): boolean {
      const urlLower = url.toLowerCase();

      // Critical resources that should be preloaded
      return (
        urlLower.includes("hero") ||
        urlLower.includes("banner") ||
        urlLower.includes("above-fold") ||
        urlLower.includes("critical") ||
        urlLower.includes("main") ||
        CRITICAL_RESOURCE_PATTERNS.fonts.some((ext) => urlLower.includes(ext))
      );
    }

    function checkResourceHints(node: any, text: string) {
      const urls = extractUrl(text);

      urls.forEach((url) => {
        foundResources.add(url);

        const resourceType = getResourceType(url);
        const isExternal = isExternalDomain(url);
        const isCritical = isCriticalResource(url);

        // Check for missing preload hints for critical resources
        if (isCritical && resourceType) {
          const preloadHint = `preload:${url}`;
          if (!foundHints.has(preloadHint)) {
            context.report({
              node,
              message: `Critical ${resourceType} '${url}' should be preloaded with <link rel="preload" as="${resourceType}" href="${url}">`,
            });
          }
        }

        // Check for missing preconnect hints for external domains
        if (isExternal) {
          try {
            const domain = new URL(url).origin;
            const preconnectHint = `preconnect:${domain}`;

            if (!foundHints.has(preconnectHint)) {
              context.report({
                node,
                message: `External resource from '${domain}' should have preconnect hint: <link rel="preconnect" href="${domain}">`,
              });
            }
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });
    }

    function checkExistingHints(node: any, text: string) {
      // Track existing resource hints
      const hintMatches = text.match(/<link[^>]+rel=["']([^"']+)["'][^>]*>/g);

      if (hintMatches) {
        hintMatches.forEach((hint) => {
          const relMatch = hint.match(/rel=["']([^"']+)["']/);
          const hrefMatch = hint.match(/href=["']([^"']+)["']/);

          if (relMatch && hrefMatch) {
            const rel = relMatch[1];
            const href = hrefMatch[1];
            foundHints.add(`${rel}:${href}`);

            // Validate proper usage of hints
            if (rel === "preload") {
              if (!hint.includes("as=")) {
                context.report({
                  node,
                  message: `Preload hint for '${href}' missing 'as' attribute. Add as="font|image|script|style|video"`,
                });
              }

              if (href.includes(".woff") && !hint.includes("crossorigin")) {
                context.report({
                  node,
                  message: `Font preload for '${href}' should include crossorigin attribute`,
                });
              }
            }

            if (rel === "prefetch") {
              // Warn if prefetching critical resources (should use preload instead)
              if (isCriticalResource(href)) {
                context.report({
                  node,
                  message: `Critical resource '${href}' uses prefetch but should use preload for immediate loading`,
                });
              }
            }
          }
        });
      }
    }

    return {
      // Template literals with HTML
      TemplateLiteral(node: any) {
        const text = context.getSourceCode().getText(node);
        checkExistingHints(node, text);
        checkResourceHints(node, text);
      },

      // String literals with HTML/URLs
      Literal(node: any) {
        if (typeof node.value === "string") {
          checkExistingHints(node, node.value);
          checkResourceHints(node, node.value);
        }
      },

      // JSX elements (link and img)
      JSXOpeningElement(node: any) {
        if (node.name?.type === "JSXIdentifier") {
          const tagName = node.name.name;

          // Handle link elements
          if (tagName === "link") {
            const relAttr = node.attributes?.find(
              (a: any) => a.name?.name === "rel"
            );
            const hrefAttr = node.attributes?.find(
              (a: any) => a.name?.name === "href"
            );
            const asAttr = node.attributes?.find(
              (a: any) => a.name?.name === "as"
            );

            if (relAttr && hrefAttr) {
              const rel = relAttr.value?.value;
              const href = hrefAttr.value?.value;

              if (rel && href) {
                foundHints.add(`${rel}:${href}`);

                // Validate preload usage
                if (rel === "preload" && !asAttr) {
                  context.report({
                    node,
                    message: `Preload link for '${href}' missing 'as' attribute`,
                  });
                }
              }
            }
          }

          // Handle img elements
          if (tagName === "img") {
            const srcAttr = node.attributes?.find(
              (a: any) => a.name?.name === "src"
            );

            if (srcAttr?.value?.value) {
              const src = srcAttr.value.value;
              foundResources.add(src);

              if (isCriticalResource(src)) {
                context.report({
                  node,
                  message: `Critical image '${src}' should be preloaded for better LCP`,
                });
              }
            }
          }
        }
      },

      // Import statements
      ImportDeclaration(node: any) {
        const source = node.source?.value as string;
        if (!source) return;

        // Check for dynamic imports that could benefit from modulepreload
        if (
          isExternalDomain(source) ||
          source.includes("/chunks/") ||
          source.includes(".chunk.")
        ) {
          context.report({
            node,
            message: `Consider modulepreload for '${source}' to optimize loading: <link rel="modulepreload" href="${source}">`,
          });
        }
      },

      // Dynamic imports
      ImportExpression(node: any) {
        if (node.source?.type === "Literal") {
          const source = node.source.value as string;

          context.report({
            node,
            message: `Dynamic import '${source}' could benefit from modulepreload hint for faster loading`,
          });
        }
      },

      // Check for missing Google Fonts preconnect
      "Program:exit"() {
        // Look for Google Fonts usage without preconnect
        const hasGoogleFonts = Array.from(foundResources).some((url) =>
          url.includes("fonts.googleapis.com")
        );

        const hasGoogleFontsPreconnect = Array.from(foundHints).some(
          (hint) =>
            hint.includes("preconnect") && hint.includes("fonts.googleapis.com")
        );

        if (hasGoogleFonts && !hasGoogleFontsPreconnect) {
          context.report({
            node: context.getSourceCode().ast,
            message:
              "Google Fonts detected but missing preconnect hints. Add <link rel='preconnect' href='https://fonts.googleapis.com'> and <link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>",
          });
        }
      },
    };
  },
};

export default rule;
