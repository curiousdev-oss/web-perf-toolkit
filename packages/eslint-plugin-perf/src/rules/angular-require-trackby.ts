import type { Rule } from "eslint";

// This rule scans inline template literals for Angular *ngFor and enforces trackBy usage
const NGFOR_PATTERN = /\*ngFor\s*=\s*"[^"]*let\s+\w+\s+of\s+[^\"]*"/g;
const TRACKBY_PATTERN = /trackBy\s*:\s*\w+/;

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Require trackBy in Angular *ngFor to avoid excessive DOM re-renders",
    },
    schema: [],
  },
  create(context) {
    function checkTemplateLiteral(node: any) {
      const source = context.getSourceCode().getText(node) || "";
      const matches = source.match(NGFOR_PATTERN);
      if (!matches) return;

      for (const ngfor of matches) {
        if (!TRACKBY_PATTERN.test(ngfor)) {
          context.report({
            node,
            message:
              "Angular *ngFor should specify trackBy to reduce DOM churn and improve performance",
          });
        }
      }
    }

    return {
      TemplateLiteral: checkTemplateLiteral,
      Literal(node: any) {
        if (typeof node.value === "string" && node.value.includes("*ngFor")) {
          checkTemplateLiteral(node);
        }
      },
    };
  },
};

export default rule;


