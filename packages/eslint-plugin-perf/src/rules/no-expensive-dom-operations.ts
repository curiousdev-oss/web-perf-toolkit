import type { Rule } from "eslint";

const EXPENSIVE_DOM_OPERATIONS = new Map([
  ["innerHTML", "Use textContent for text or DocumentFragment for HTML"],
  ["outerHTML", "Use more specific DOM methods for better performance"],
  ["appendChild", "Consider DocumentFragment for multiple operations"],
  ["insertBefore", "Consider DocumentFragment for multiple operations"],
  ["removeChild", "Use remove() method or batch operations"],
  ["cloneNode", "Cache cloned nodes when possible"],
  ["getBoundingClientRect", "Cache layout values when possible - triggers reflow"],
  ["offsetWidth", "Cache layout values when possible - triggers reflow"],
  ["offsetHeight", "Cache layout values when possible - triggers reflow"],
  ["offsetTop", "Cache layout values when possible - triggers reflow"],
  ["offsetLeft", "Cache layout values when possible - triggers reflow"],
  ["scrollWidth", "Cache layout values when possible - triggers reflow"],
  ["scrollHeight", "Cache layout values when possible - triggers reflow"],
  ["clientWidth", "Cache layout values when possible - triggers reflow"],
  ["clientHeight", "Cache layout values when possible - triggers reflow"],
  ["getComputedStyle", "Cache computed styles when possible - triggers reflow"],
]);

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Prevent expensive DOM operations that cause layout thrashing and reflows",
    },
    schema: [],
  },
  create(context) {
    let inLoop = false;
    
    function checkDOMOperation(node: any) {
      if (node.type !== "MemberExpression") return;
      
      const prop = node.property;
      if (!prop?.name) return;
      
      const suggestion = EXPENSIVE_DOM_OPERATIONS.get(prop.name);
      if (!suggestion) return;
      
      const severity = inLoop ? "CRITICAL" : "WARNING";
      const loopContext = inLoop ? " inside a loop" : "";
      
      // Special handling for layout-triggering properties
      const layoutTriggers = [
        "getBoundingClientRect", "offsetWidth", "offsetHeight", "offsetTop", "offsetLeft",
        "scrollWidth", "scrollHeight", "clientWidth", "clientHeight", "getComputedStyle"
      ];
      
      if (layoutTriggers.includes(prop.name)) {
        context.report({
          node,
          message: `${severity}: '${prop.name}' triggers layout reflow${loopContext}. ${suggestion}`,
        });
      } else {
        context.report({
          node,
          message: `${severity}: '${prop.name}' is expensive${loopContext}. ${suggestion}`,
        });
      }
    }
    
    function checkStyleAccess(node: any) {
      // Check for style property access that triggers reflow
      if (node.type === "MemberExpression" && 
          node.object?.type === "MemberExpression" &&
          node.object.property?.name === "style") {
        
        const severity = inLoop ? "CRITICAL" : "WARNING";
        const loopContext = inLoop ? " inside a loop" : "";
        
        context.report({
          node,
          message: `${severity}: Direct style access${loopContext} can cause layout thrashing. Use CSS classes or batch style changes`,
        });
      }
    }
    
    function checkQuerySelectorUsage(node: any) {
      if (node.type === "CallExpression" && 
          node.callee?.type === "MemberExpression") {
        
        const obj = node.callee.object;
        const prop = node.callee.property;
        
        if (obj?.name === "document" && prop?.name) {
          const queryMethods = ["querySelector", "querySelectorAll", "getElementById"];
          
          if (queryMethods.includes(prop.name)) {
            const severity = inLoop ? "CRITICAL" : "WARNING";
            const loopContext = inLoop ? " inside a loop" : "";
            
            context.report({
              node,
              message: `${severity}: DOM query '${prop.name}'${loopContext} is expensive. Cache the result`,
            });
          }
        }
      }
    }
    
    return {
      // Track loop context
      ForStatement() { inLoop = true; },
      "ForStatement:exit"() { inLoop = false; },
      ForInStatement() { inLoop = true; },
      "ForInStatement:exit"() { inLoop = false; },
      ForOfStatement() { inLoop = true; },
      "ForOfStatement:exit"() { inLoop = false; },
      WhileStatement() { inLoop = true; },
      "WhileStatement:exit"() { inLoop = false; },
      DoWhileStatement() { inLoop = true; },
      "DoWhileStatement:exit"() { inLoop = false; },
      
      MemberExpression(node: any) {
        checkDOMOperation(node);
        checkStyleAccess(node);
      },
      
      CallExpression(node: any) {
        checkQuerySelectorUsage(node);
        
        // Check for document.write (blocks parsing)
        if (node.callee?.type === "MemberExpression" &&
            node.callee.object?.name === "document" &&
            node.callee.property?.name === "write") {
          context.report({
            node,
            message: "CRITICAL: document.write() blocks HTML parsing. Use modern DOM methods",
          });
        }
      },
      
      // Check for synchronous XMLHttpRequest
      NewExpression(node: any) {
        if (node.callee?.name === "XMLHttpRequest") {
          // This will be flagged later if they use synchronous mode
          // but we can warn about modern alternatives
          context.report({
            node,
            message: "Consider using fetch() API instead of XMLHttpRequest for better performance and modern standards",
          });
        }
      },
    };
  },
};

export default rule;
