import type { Rule } from "eslint";

const INEFFICIENT_PATTERNS = new Map([
  ["document.querySelectorAll", "Cache DOM queries outside loops"],
  ["document.querySelector", "Cache DOM queries outside loops"],
  ["document.getElementById", "Cache DOM queries outside loops"],
  ["document.getElementsByClassName", "Cache DOM queries outside loops"],
  ["document.getElementsByTagName", "Cache DOM queries outside loops"],
  ["console.log", "Remove console statements or use conditional logging"],
  ["JSON.parse", "Cache parsed objects outside loops"],
  ["JSON.stringify", "Cache serialized strings outside loops"],
]);

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevent performance-damaging patterns inside loops",
    },
    schema: [],
  },
  create(context) {
    let loopDepth = 0;
    
    function enterLoop() {
      loopDepth++;
    }
    
    function exitLoop() {
      loopDepth--;
    }
    
    function checkPerformancePattern(node: any) {
      if (loopDepth === 0) return;
      
      // Check for DOM queries
      if (node.type === "MemberExpression") {
        const obj = node.object;
        const prop = node.property;
        
        if (obj?.name === "document" && prop?.name) {
          const apiName = `document.${prop.name}`;
          const suggestion = INEFFICIENT_PATTERNS.get(apiName);
          if (suggestion) {
            context.report({
              node,
              message: `Avoid '${apiName}' inside loops. ${suggestion}`,
            });
          }
        }
        
        // Check for console.log
        if (obj?.name === "console" && prop?.name === "log") {
          context.report({
            node,
            message: "Avoid console.log inside loops. Remove or use conditional logging",
          });
        }
        
        // Check for JSON operations
        if (obj?.name === "JSON" && prop?.name) {
          const apiName = `JSON.${prop.name}`;
          const suggestion = INEFFICIENT_PATTERNS.get(apiName);
          if (suggestion) {
            context.report({
              node,
              message: `Avoid '${apiName}' inside loops. ${suggestion}`,
            });
          }
        }
      }
      
      // Check for function calls that should be cached
      if (node.type === "CallExpression") {
        const callee = node.callee;
        
        // Check for array methods that create new arrays
        if (callee?.type === "MemberExpression" && callee.property?.name) {
          const methodName = callee.property.name;
          const expensiveMethods = ["map", "filter", "reduce", "sort", "slice"];
          
          if (expensiveMethods.includes(methodName)) {
            context.report({
              node,
              message: `Avoid array.${methodName}() inside loops. Cache the result or move outside the loop`,
            });
          }
        }
      }
    }
    
    return {
      ForStatement: enterLoop,
      "ForStatement:exit": exitLoop,
      ForInStatement: enterLoop,
      "ForInStatement:exit": exitLoop,
      ForOfStatement: enterLoop,
      "ForOfStatement:exit": exitLoop,
      WhileStatement: enterLoop,
      "WhileStatement:exit": exitLoop,
      DoWhileStatement: enterLoop,
      "DoWhileStatement:exit": exitLoop,
      
      MemberExpression: checkPerformancePattern,
      CallExpression: checkPerformancePattern,
    };
  },
};

export default rule;
