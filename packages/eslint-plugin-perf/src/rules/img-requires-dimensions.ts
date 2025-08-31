import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Images must declare dimensions to avoid Cumulative Layout Shift (CLS)",
    },
    schema: [],
  },
  create(context) {
    function checkImageDimensions(
      node: any,
      tagName: string,
      attributes: any[]
    ) {
      const attrs = new Map<string, any>();
      for (const attr of attributes || []) {
        if (attr.name) {
          attrs.set(attr.name, attr);
        }
      }

      const hasW = attrs.has("width");
      const hasH = attrs.has("height");
      const styleAttr = attrs.get("style");
      const src = context.getSourceCode();
      const styleText = styleAttr ? src.getText(styleAttr) : "";
      const hasAspect =
        /aspectRatio|aspect-ratio|width.*height|height.*width/.test(styleText);

      if (!(hasW && hasH) && !hasAspect) {
        context.report({
          node,
          message: `<${tagName}> must declare width/height attributes or CSS dimensions to prevent layout shifts`,
        });
      }
    }

    return {
      // JSX (React/Angular JSX)
      JSXOpeningElement(node: any) {
        if (node.name?.type === "JSXIdentifier" && node.name.name === "img") {
          const attrs =
            node.attributes?.map((a: any) => ({
              name: a.name?.name,
              value: a.value,
            })) || [];
          checkImageDimensions(node, "img", attrs);
        }
      },

      // HTML in template strings (Angular templates, lit-html, etc.)
      TemplateLiteral(node: any) {
        const source = context.getSourceCode().getText(node);
        const imgMatches = source.match(/<img[^>]*>/g);

        if (imgMatches) {
          for (const imgTag of imgMatches) {
            const hasWidth = /width\s*=/.test(imgTag);
            const hasHeight = /height\s*=/.test(imgTag);
            const hasStyle = /style\s*=/.test(imgTag);
            const styleContent =
              imgTag.match(/style\s*=\s*["']([^"']*)["']/)?.[1] || "";
            const hasCSSDimensions = /width|height|aspect-ratio/.test(
              styleContent
            );

            if (!(hasWidth && hasHeight) && !(hasStyle && hasCSSDimensions)) {
              context.report({
                node,
                message:
                  "Images in templates must declare dimensions to prevent layout shifts",
              });
            }
          }
        }
      },
    };
  },
};

export default rule;
