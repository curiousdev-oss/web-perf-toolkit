import type { Rule } from "eslint";

type Options = [{ deny?: string[] }?];

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow heavy namespace imports like `import * as _ from 'lodash'`",
    },
    schema: [
      {
        type: "object",
        properties: { deny: { type: "array", items: { type: "string" } } },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const [{ deny = ["lodash", "moment"] } = {}] = context.options as Options;
    return {
      ImportDeclaration(node: any) {
        const source = node.source?.value as string;
        if (!source) return;
        const isDenied = deny.some((pkg) => source === pkg);
        if (!isDenied) return;
        const ns = node.specifiers?.find(
          (s: any) => s.type === "ImportNamespaceSpecifier"
        );
        if (ns) {
          context.report({
            node,
            message: `Avoid namespace import from '${source}'. Import specific modules or use lighter alternatives.`,
          });
        }
      },
    };
  },
};

export default rule;
