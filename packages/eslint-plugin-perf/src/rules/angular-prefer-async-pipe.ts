import type { Rule } from "eslint";

// Heuristic: discourage direct subscribe() in Angular component classes; prefer async pipe
// Allows explicit Subscription management patterns but still reports to encourage pipe

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer Angular async pipe over manual subscribe() in components to avoid leaks and extra change detection",
    },
    schema: [],
  },
  create(context) {
    let inClass = false;

    function isAngularClass(node: any): boolean {
      // Best-effort: presence of decorators or Angular lifecycle methods
      const decorators: any[] = (node as any).decorators || [];
      if (decorators.some((d: any) => d?.expression?.callee?.name === "Component")) return true;
      const body: any[] = node?.body?.body || [];
      const lifecycle = new Set([
        "ngOnInit",
        "ngOnDestroy",
        "ngAfterViewInit",
        "ngAfterContentInit",
      ]);
      return body.some((m: any) => m?.key && lifecycle.has(m.key.name));
    }

    return {
      ClassDeclaration(node: any) {
        inClass = isAngularClass(node);
      },
      "ClassDeclaration:exit"() {
        inClass = false;
      },

      MemberExpression(node: any) {
        if (!inClass) return;
        if (node.property?.name === "subscribe" && node.parent?.type === "CallExpression") {
          context.report({
            node: node.parent,
            message:
              "Prefer using the Angular async pipe in templates instead of subscribe() in components",
          });
        }
      },
    };
  },
};

export default rule;


