import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Encourage efficient data structures and algorithms for better performance",
    },
    schema: [],
  },
  create(context) {
    return {
      // Check for inefficient array operations
      CallExpression(node: any) {
        if (node.callee?.type === "MemberExpression") {
          const obj = node.callee.object;
          const prop = node.callee.property;
          
          // Array.indexOf for existence checking
          if (prop?.name === "indexOf" && node.parent?.type === "BinaryExpression") {
            const parent = node.parent;
            if ((parent.operator === "!==" || parent.operator === "!=") &&
                parent.right?.type === "Literal" && parent.right.value === -1) {
              context.report({
                node,
                message: "Use Set.has() or Array.includes() instead of indexOf() !== -1 for better performance and readability",
              });
            }
          }
          
          // Array.find for simple existence checking
          if (prop?.name === "find" && 
              node.parent?.type === "BinaryExpression" &&
              (node.parent.operator === "!==" || node.parent.operator === "!==")) {
            context.report({
              node,
              message: "Use Array.some() instead of Array.find() for existence checking - it's more efficient",
            });
          }
          
          // Array.filter followed by length check
          if (prop?.name === "filter" &&
              node.parent?.type === "MemberExpression" &&
              node.parent.property?.name === "length") {
            context.report({
              node,
              message: "Use Array.some() instead of Array.filter().length for existence checking - avoids creating intermediate array",
            });
          }
          
          // Nested array methods that could be optimized
          if (["map", "filter", "reduce"].includes(prop?.name)) {
            const argFunc = node.arguments?.[0];
            if (argFunc?.type === "ArrowFunctionExpression" || argFunc?.type === "FunctionExpression") {
              const body = argFunc.body;
              
              // Check for nested array methods in the callback
              if (body?.type === "CallExpression" && 
                  body.callee?.type === "MemberExpression" &&
                  ["map", "filter", "reduce", "find", "some", "every"].includes(body.callee.property?.name)) {
                context.report({
                  node,
                  message: `Nested array method ${prop.name}().${body.callee.property.name}() creates performance overhead. Consider optimizing with a single loop or different data structure`,
                });
              }
            }
          }
        }
        
        // Check for Object.keys/values/entries in loops or frequent operations
        if (node.callee?.type === "MemberExpression" &&
            node.callee.object?.name === "Object" &&
            ["keys", "values", "entries"].includes(node.callee.property?.name)) {
          
          // Check if this is inside a loop or frequent operation
          let parent = node.parent;
          while (parent) {
            if (["ForStatement", "ForInStatement", "ForOfStatement", "WhileStatement", "DoWhileStatement"].includes(parent.type)) {
              context.report({
                node,
                message: `Object.${node.callee.property.name}() inside loops is inefficient. Cache the result or use Map/Set for frequent lookups`,
              });
              break;
            }
            parent = parent.parent;
          }
        }
        
        // JSON.parse(JSON.stringify()) pattern for deep cloning
        if (node.callee?.type === "MemberExpression" &&
            node.callee.object?.name === "JSON" &&
            node.callee.property?.name === "parse" &&
            node.arguments?.[0]?.type === "CallExpression") {
          
          const arg = node.arguments[0];
          if (arg.callee?.type === "MemberExpression" &&
              arg.callee.object?.name === "JSON" &&
              arg.callee.property?.name === "stringify") {
            context.report({
              node,
              message: "JSON.parse(JSON.stringify()) for cloning is inefficient. Use structured cloning algorithm or dedicated libraries",
            });
          }
        }
      },
      
      // Check for Array constructor with number argument
      NewExpression(node: any) {
        if (node.callee?.name === "Array" && node.arguments?.length === 1) {
          const arg = node.arguments[0];
          if (arg?.type === "Literal" && typeof arg.value === "number" && arg.value > 1000) {
            context.report({
              node,
              message: `Creating large Array(${arg.value}) may cause performance issues. Consider using typed arrays or lazy initialization`,
            });
          }
        }
        
        // Check for RegExp in loops (should be cached)
        if (node.callee?.name === "RegExp") {
          let parent = node.parent;
          while (parent) {
            if (["ForStatement", "ForInStatement", "ForOfStatement", "WhileStatement", "DoWhileStatement"].includes(parent.type)) {
              context.report({
                node,
                message: "Creating RegExp inside loops is inefficient. Move regex creation outside the loop",
              });
              break;
            }
            parent = parent.parent;
          }
        }
      },
      
      // Check for frequent string concatenation
      BinaryExpression(node: any) {
        if (node.operator === "+") {
          // Look for multiple string concatenations that could use template literals or array.join
          let concatenationCount = 1;
          let current = node;
          
          // Count chained concatenations
          while (current.left?.type === "BinaryExpression" && current.left.operator === "+") {
            concatenationCount++;
            current = current.left;
          }
          
          if (concatenationCount >= 3) {
            context.report({
              node,
              message: `Multiple string concatenations (${concatenationCount}) detected. Use template literals or Array.join() for better performance`,
            });
          }
        }
      },
      
      // Check for inefficient for-in loops on arrays
      ForInStatement(node: any) {
        // Try to detect if the object being iterated is likely an array
        const right = node.right;
        if (right?.type === "Identifier") {
          // This is a simple heuristic - in real usage, type information would be better
          const varName = right.name;
          if (varName.includes("array") || varName.includes("list") || varName.includes("items")) {
            context.report({
              node,
              message: "for-in loop on arrays is inefficient. Use for-of or traditional for loop for better performance",
            });
          }
        }
      },
      
      // Suggest Map/Set for frequent lookups
      Property(node: any) {
        // Check for objects used as lookup tables with many properties
        if (node.parent?.type === "ObjectExpression" && 
            node.parent.properties?.length > 10) {
          context.report({
            node: node.parent,
            message: "Large object literals used for lookups are inefficient. Consider using Map for better performance with frequent operations",
          });
        }
      },
      
      // Additional CallExpression checks need to be merged with the main one above
      // Check for deep object cloning that could be optimized in the main CallExpression handler
    };
  },
};

export default rule;
