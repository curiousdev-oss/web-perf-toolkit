import type { Rule } from "eslint";

// Suggest usage of NgOptimizedImage (Angular v15+) in inline templates and enforce width/height
// Works heuristically on template literals and string literals containing HTML

const IMG_TAG_REGEX = /<img[^>]*>/g;

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Suggest using Angular NgOptimizedImage (ngSrc) and enforce width/height in inline templates",
    },
    schema: [],
  },
  create(context) {
    function reportForImgTag(node: any, imgTag: string) {
      const lacksWidth = !/\swidth=/.test(imgTag);
      const lacksHeight = !/\sheight=/.test(imgTag);
      const usesSrc = /\ssrc=/.test(imgTag);
      const usesNgSrc = /\sngSrc=/.test(imgTag);

      if (usesSrc && !usesNgSrc) {
        context.report({
          node,
          message:
            "Use NgOptimizedImage: replace src with ngSrc and import provideImg from @angular/common",
        });
      }

      if (lacksWidth || lacksHeight) {
        context.report({
          node,
          message:
            "Add explicit width and height to <img> to prevent layout shift (CLS)",
        });
      }
    }

    function scanTemplate(node: any) {
      const source = context.getSourceCode().getText(node) || "";
      const matches = source.match(IMG_TAG_REGEX);
      if (!matches) return;
      for (const tag of matches) {
        reportForImgTag(node, tag);
      }
    }

    return {
      TemplateLiteral: scanTemplate,
      Literal(node: any) {
        if (typeof node.value === "string" && node.value.includes("<img")) {
          scanTemplate(node);
        }
      },
      JSXOpeningElement(node: any) {
        // Also apply when JSX is used in Angular hybrid or other contexts
        if (node.name?.type === "JSXIdentifier" && node.name.name === "img") {
          const attrs = new Map<string, any>();
          for (const a of node.attributes || []) {
            const key = a?.name?.name;
            if (key) attrs.set(key, a);
          }
          const hasWidth = attrs.has("width");
          const hasHeight = attrs.has("height");
          const hasSrc = attrs.has("src");
          const hasNgSrc = attrs.has("ngSrc");

          if (hasSrc && !hasNgSrc) {
            context.report({
              node,
              message:
                "Use NgOptimizedImage: replace src with ngSrc and import provideImg from @angular/common",
            });
          }
          if (!hasWidth || !hasHeight) {
            context.report({
              node,
              message:
                "Add explicit width and height to <img> to prevent layout shift (CLS)",
            });
          }
        }
      },
    };
  },
};

export default rule;


