import type { Rule } from "eslint";

const SYNC_BLOCKING_RENDER_APIS = new Set([
  "localStorage.getItem",
  "localStorage.setItem",
  "sessionStorage.getItem",
  "sessionStorage.setItem",
  "document.cookie",
  "btoa",
  "atob",
  "JSON.parse",
  "JSON.stringify",
  "Date.now",
  "performance.now",
  "Math.random",
]);

const RENDER_FUNCTIONS = new Set([
  "render",
  "componentDidMount",
  "componentDidUpdate",
  "componentWillMount",
  "componentWillUpdate",
  "getSnapshotBeforeUpdate",
  "ngOnInit",
  "ngAfterViewInit",
  "ngAfterContentInit",
  "ngAfterViewChecked",
  "ngAfterContentChecked",
]);

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Prevent synchronous APIs in render functions that block the main thread and hurt performance",
    },
    schema: [],
  },
  create(context) {
    let currentFunction: string | null = null;
    let isInRenderFunction = false;

    function enterFunction(node: any) {
      const functionName = node.key?.name || node.id?.name || "";

      if (RENDER_FUNCTIONS.has(functionName)) {
        currentFunction = functionName;
        isInRenderFunction = true;
      }
    }

    function exitFunction() {
      currentFunction = null;
      isInRenderFunction = false;
    }

    function checkSyncAPI(node: any, apiName: string) {
      if (!isInRenderFunction) return;

      context.report({
        node,
        message: `Avoid synchronous '${apiName}' in render function '${currentFunction}'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.`,
      });
    }

    return {
      // Function declarations and expressions
      FunctionDeclaration: enterFunction,
      "FunctionDeclaration:exit": exitFunction,
      FunctionExpression: enterFunction,
      "FunctionExpression:exit": exitFunction,
      ArrowFunctionExpression: enterFunction,
      "ArrowFunctionExpression:exit": exitFunction,

      // Method definitions in classes
      MethodDefinition: enterFunction,
      "MethodDefinition:exit": exitFunction,

      // Property methods in objects
      Property(node: any) {
        if (
          node.method ||
          node.value?.type === "FunctionExpression" ||
          node.value?.type === "ArrowFunctionExpression"
        ) {
          enterFunction(node);
        }
      },
      "Property:exit"(node: any) {
        if (
          node.method ||
          node.value?.type === "FunctionExpression" ||
          node.value?.type === "ArrowFunctionExpression"
        ) {
          exitFunction();
        }
      },

      MemberExpression(node: any) {
        if (!isInRenderFunction) return;

        const obj = node.object;
        const prop = node.property;

        // Check for storage APIs
        if (
          (obj?.name === "localStorage" || obj?.name === "sessionStorage") &&
          prop?.name
        ) {
          checkSyncAPI(node, `${obj.name}.${prop.name}`);
        }

        // Check for document.cookie
        if (obj?.name === "document" && prop?.name === "cookie") {
          checkSyncAPI(node, "document.cookie");
        }

        // Check for JSON operations
        if (obj?.name === "JSON" && prop?.name) {
          checkSyncAPI(node, `JSON.${prop.name}`);
        }

        // Check for Date/performance APIs
        if (obj?.name === "Date" && prop?.name === "now") {
          checkSyncAPI(node, "Date.now");
        }

        if (obj?.name === "performance" && prop?.name === "now") {
          checkSyncAPI(node, "performance.now");
        }

        if (obj?.name === "Math" && prop?.name === "random") {
          checkSyncAPI(node, "Math.random");
        }
      },

      CallExpression(node: any) {
        if (!isInRenderFunction) return;

        // Check for global sync functions
        if (node.callee?.name === "btoa") {
          checkSyncAPI(node, "btoa");
        }

        if (node.callee?.name === "atob") {
          checkSyncAPI(node, "atob");
        }

        // Check for synchronous XHR
        if (
          node.callee?.type === "MemberExpression" &&
          node.callee.property?.name === "open" &&
          node.arguments?.length >= 3 &&
          node.arguments[2]?.type === "Literal" &&
          node.arguments[2].value === false
        ) {
          checkSyncAPI(node, "XMLHttpRequest.open (synchronous)");
        }
      },
    };
  },
};

export default rule;
