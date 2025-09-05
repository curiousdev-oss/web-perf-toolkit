import type { Rule } from "eslint";

function isAngularComponentClass(node: any): boolean {
  if (!node || node.type !== "ClassDeclaration") return false;
  // Prefer decorator-aware AST (requires @typescript-eslint parser)
  const decorators: any[] = (node as any).decorators || [];
  for (const decorator of decorators) {
    const expr = decorator?.expression;
    if (expr?.type === "CallExpression") {
      const callee = expr.callee;
      if ((callee?.type === "Identifier" && callee.name === "Component") ||
          (callee?.type === "MemberExpression" && callee.property?.name === "Component")) {
        return true;
      }
    }
  }
  return false;
}

function getComponentDecoratorObjectLiteral(node: any): any | null {
  const decorators: any[] = (node as any).decorators || [];
  for (const decorator of decorators) {
    const expr = decorator?.expression;
    if (expr?.type === "CallExpression") {
      const callee = expr.callee;
      const isComponent = (callee?.type === "Identifier" && callee.name === "Component") ||
        (callee?.type === "MemberExpression" && callee.property?.name === "Component");
      if (isComponent) {
        const arg0 = expr.arguments?.[0];
        if (arg0 && (arg0.type === "ObjectExpression")) {
          return arg0;
        }
      }
    }
  }
  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Enforce ChangeDetectionStrategy.OnPush for Angular components to reduce change detection work",
    },
    schema: [],
  },
  create(context) {
    return {
      ClassDeclaration(node: any) {
        try {
          if (!isAngularComponentClass(node)) {
            return;
          }

          const metaObject = getComponentDecoratorObjectLiteral(node);
          if (!metaObject) {
            // No metadata to inspect; skip
            return;
          }

          const changeDetectionProp = metaObject.properties?.find(
            (p: any) => p?.key?.name === "changeDetection" || p?.key?.value === "changeDetection"
          );

          if (!changeDetectionProp) {
            context.report({
              node,
              message:
                "Angular component should set changeDetection: ChangeDetectionStrategy.OnPush for better performance",
            });
            return;
          }

          // Validate value is ChangeDetectionStrategy.OnPush
          const value = changeDetectionProp.value;
          const isOnPush =
            (value?.type === "MemberExpression" &&
              value.object?.name === "ChangeDetectionStrategy" &&
              value.property?.name === "OnPush") ||
            (value?.type === "Identifier" && value.name === "OnPush");

          if (!isOnPush) {
            context.report({
              node: changeDetectionProp,
              message:
                "Use ChangeDetectionStrategy.OnPush to minimize change detection cycles",
            });
          }
        } catch {
          // Be resilient to AST variations
        }
      },
    };
  },
};

export default rule;


