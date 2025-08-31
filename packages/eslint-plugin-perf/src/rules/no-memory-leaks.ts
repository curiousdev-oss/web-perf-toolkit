import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Prevent common memory leak patterns in JavaScript/TypeScript applications",
    },
    schema: [],
  },
  create(context) {
    const intervalTimers = new Set<any>();
    const eventListeners = new Set<any>();

    function checkClosureReferences(node: any) {
      // Check if function captures large objects or DOM elements
      const sourceCode = context.getSourceCode();
      const functionText = sourceCode.getText(node);

      // Simple heuristic: check for common leak patterns
      const leakPatterns = [
        /this\.\w+\s*=.*document\./, // Storing DOM refs in this
        /window\.\w+\s*=/, // Creating global variables
        /\w+\s*=.*new\s+Array\(/, // Large array creation in closures
      ];

      for (const pattern of leakPatterns) {
        if (pattern.test(functionText)) {
          context.report({
            node,
            message:
              "Function may create memory leaks through closure references. Review captured variables and DOM references",
          });
          break;
        }
      }
    }

    return {
      // Track setInterval/setTimeout calls
      CallExpression(node: any) {
        if (node.callee?.type === "Identifier") {
          const funcName = node.callee.name;

          // Check for setInterval without clearInterval
          if (funcName === "setInterval") {
            intervalTimers.add(node);
            context.report({
              node,
              message:
                "setInterval() can cause memory leaks. Ensure clearInterval() is called when component/module is destroyed",
            });
          }

          // Check for setTimeout with long delays
          if (funcName === "setTimeout" && node.arguments?.length >= 2) {
            const delay = node.arguments[1];
            if (
              delay?.type === "Literal" &&
              typeof delay.value === "number" &&
              delay.value > 30000
            ) {
              context.report({
                node,
                message: `setTimeout with ${delay.value}ms delay may cause memory leaks. Consider using intervals or shorter delays`,
              });
            }
          }

          // Check for addEventListener without removeEventListener
          if (
            funcName === "addEventListener" ||
            (node.callee?.type === "MemberExpression" &&
              node.callee.property?.name === "addEventListener")
          ) {
            eventListeners.add(node);
            context.report({
              node,
              message:
                "addEventListener() can cause memory leaks. Ensure removeEventListener() is called when component/module is destroyed",
            });
          }
        }

        // Check for DOM element references stored in variables
        if (node.callee?.type === "MemberExpression") {
          const obj = node.callee.object;
          const prop = node.callee.property;

          if (
            obj?.name === "document" &&
            prop?.name &&
            ["querySelector", "querySelectorAll", "getElementById"].includes(
              prop.name
            )
          ) {
            // Check if result is stored in a closure or global scope
            const parent = node.parent;
            if (
              parent?.type === "VariableDeclarator" ||
              parent?.type === "AssignmentExpression"
            ) {
              context.report({
                node,
                message:
                  "Storing DOM element references can cause memory leaks. Consider using weak references or clearing references when done",
              });
            }
          }
        }
      },

      // Check for potential closure memory leaks
      FunctionExpression(node: any) {
        checkClosureReferences(node);
      },

      ArrowFunctionExpression(node: any) {
        checkClosureReferences(node);
      },

      // Check for potential Angular-specific memory leaks
      Property(node: any) {
        if (
          node.key?.name === "ngOnDestroy" ||
          node.key?.value === "ngOnDestroy"
        ) {
          // Check if ngOnDestroy is implemented but empty
          const value = node.value;
          if (
            value?.type === "FunctionExpression" ||
            value?.type === "ArrowFunctionExpression"
          ) {
            if (!value.body?.body?.length) {
              context.report({
                node,
                message:
                  "Empty ngOnDestroy() method. Consider implementing cleanup for subscriptions, timers, and event listeners",
              });
            }
          }
        }
      },

      // Check for Observable subscriptions without unsubscribe (Angular)
      MemberExpression(node: any) {
        if (
          node.property?.name === "subscribe" &&
          node.parent?.type === "CallExpression"
        ) {
          context.report({
            node: node.parent,
            message:
              "Observable subscriptions can cause memory leaks. Store subscription reference and unsubscribe in ngOnDestroy()",
          });
        }
      },
    };
  },
};

export default rule;
