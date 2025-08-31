import noMemoryLeaks from '../../src/rules/no-memory-leaks';

describe('no-memory-leaks', () => {
  let context: any;
  let reportSpy: jest.Mock;

  beforeEach(() => {
    reportSpy = jest.fn();
    context = {
      report: reportSpy,
      getSourceCode: () => ({
        getText: jest.fn().mockReturnValue('this.domRef = document.querySelector("#test")'),
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Timer Functions', () => {
    it('should report error for setInterval', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(createIdentifier('setInterval'), [
        createIdentifier('callback'),
        createLiteral(1000)
      ]);

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "setInterval() can cause memory leaks. Ensure clearInterval() is called when component/module is destroyed",
      });
    });

    it('should report error for setTimeout with long delay', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(createIdentifier('setTimeout'), [
        createIdentifier('callback'),
        createLiteral(35000) // > 30000ms
      ]);

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "setTimeout with 35000ms delay may cause memory leaks. Consider using intervals or shorter delays",
      });
    });

    it('should not report error for setTimeout with short delay', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(createIdentifier('setTimeout'), [
        createIdentifier('callback'),
        createLiteral(5000) // < 30000ms
      ]);

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle setTimeout without delay argument', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(createIdentifier('setTimeout'), [
        createIdentifier('callback')
      ]);

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    it('should report error for addEventListener', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(createIdentifier('addEventListener'), [
        createLiteral('click'),
        createIdentifier('handler')
      ]);

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "addEventListener() can cause memory leaks. Ensure removeEventListener() is called when component/module is destroyed",
      });
    });

    it('should report error for element.addEventListener', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'CallExpression',
        callee: {
          type: 'MemberExpression',
          object: { name: 'element' },
          property: { name: 'addEventListener' }
        },
        arguments: [
          createLiteral('click'),
          createIdentifier('handler')
        ]
      };

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "addEventListener() can cause memory leaks. Ensure removeEventListener() is called when component/module is destroyed",
      });
    });
  });

  describe('DOM Element References', () => {
    it('should report error for storing querySelector result', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'querySelector'),
        [createLiteral('#test')]
      );
      
      // Mock parent as variable declarator
      node.parent = { type: 'VariableDeclarator' };

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Storing DOM element references can cause memory leaks. Consider using weak references or clearing references when done",
      });
    });

    it('should report error for storing querySelectorAll result', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'querySelectorAll'),
        [createLiteral('.test')]
      );
      
      // Mock parent as assignment expression
      node.parent = { type: 'AssignmentExpression' };

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Storing DOM element references can cause memory leaks. Consider using weak references or clearing references when done",
      });
    });

    it('should report error for storing getElementById result', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'getElementById'),
        [createLiteral('test')]
      );
      
      // Mock parent as variable declarator
      node.parent = { type: 'VariableDeclarator' };

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Storing DOM element references can cause memory leaks. Consider using weak references or clearing references when done",
      });
    });

    it('should not report error for immediate DOM queries', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'querySelector'),
        [createLiteral('#test')]
      );
      
      // No parent or different parent type
      node.parent = { type: 'CallExpression' };

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Closure Memory Leaks', () => {
    it('should report error for function capturing DOM references', () => {
      const rule = noMemoryLeaks.create(context);
      context.getSourceCode = () => ({
        getText: jest.fn().mockReturnValue('function() { this.domElement = document.querySelector("#test"); }'),
      });

      const node = {
        type: 'FunctionExpression',
        body: { body: [] },
      };

      if (rule.FunctionExpression) {
        (rule.FunctionExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Function may create memory leaks through closure references. Review captured variables and DOM references",
      });
    });

    it('should report error for function creating global variables', () => {
      const rule = noMemoryLeaks.create(context);
      context.getSourceCode = () => ({
        getText: jest.fn().mockReturnValue('function() { window.globalVar = data; }'),
      });

      const node = {
        type: 'ArrowFunctionExpression',
        body: { body: [] },
      };

      if (rule.ArrowFunctionExpression) {
        (rule.ArrowFunctionExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Function may create memory leaks through closure references. Review captured variables and DOM references",
      });
    });

    it('should report error for function creating large arrays', () => {
      const rule = noMemoryLeaks.create(context);
      context.getSourceCode = () => ({
        getText: jest.fn().mockReturnValue('function() { var arr = new Array(10000); }'),
      });

      const node = {
        type: 'FunctionExpression',
        body: { body: [] },
      };

      if (rule.FunctionExpression) {
        (rule.FunctionExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Function may create memory leaks through closure references. Review captured variables and DOM references",
      });
    });

    it('should not report error for safe functions', () => {
      const rule = noMemoryLeaks.create(context);
      context.getSourceCode = () => ({
        getText: jest.fn().mockReturnValue('function() { return 42; }'),
      });

      const node = {
        type: 'FunctionExpression',
        body: { body: [] },
      };

      if (rule.FunctionExpression) {
        (rule.FunctionExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Angular-specific Memory Leaks', () => {
    it('should report error for empty ngOnDestroy method', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'Property',
        key: { name: 'ngOnDestroy' },
        value: {
          type: 'FunctionExpression',
          body: { body: [] } // Empty body
        }
      };

      if (rule.Property) {
        (rule.Property as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Empty ngOnDestroy() method. Consider implementing cleanup for subscriptions, timers, and event listeners",
      });
    });

    it('should report error for empty ngOnDestroy arrow function', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'Property',
        key: { value: 'ngOnDestroy' },
        value: {
          type: 'ArrowFunctionExpression',
          body: { body: [] } // Empty body
        }
      };

      if (rule.Property) {
        (rule.Property as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Empty ngOnDestroy() method. Consider implementing cleanup for subscriptions, timers, and event listeners",
      });
    });

    it('should not report error for ngOnDestroy with implementation', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'Property',
        key: { name: 'ngOnDestroy' },
        value: {
          type: 'FunctionExpression',
          body: { body: [{ type: 'ExpressionStatement' }] } // Has content
        }
      };

      if (rule.Property) {
        (rule.Property as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for non-ngOnDestroy properties', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'Property',
        key: { name: 'otherMethod' },
        value: {
          type: 'FunctionExpression',
          body: { body: [] }
        }
      };

      if (rule.Property) {
        (rule.Property as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Observable Subscriptions', () => {
    it('should report error for observable subscribe', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'MemberExpression',
        property: { name: 'subscribe' },
        parent: { type: 'CallExpression' }
      };

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node: node.parent,
        message: "Observable subscriptions can cause memory leaks. Store subscription reference and unsubscribe in ngOnDestroy()",
      });
    });

    it('should not report error for subscribe without call expression parent', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'MemberExpression',
        property: { name: 'subscribe' },
        parent: { type: 'MemberExpression' }
      };

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for other method calls', () => {
      const rule = noMemoryLeaks.create(context);
      const node = {
        type: 'MemberExpression',
        property: { name: 'map' },
        parent: { type: 'CallExpression' }
      };

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined nodes gracefully', () => {
      const rule = noMemoryLeaks.create(context);
      
      expect(() => {
        if (rule.CallExpression) {
          rule.CallExpression({ callee: null } as any);
        }
        if (rule.FunctionExpression) {
          rule.FunctionExpression({} as any);
        }
        if (rule.MemberExpression) {
          rule.MemberExpression({ property: null } as any);
        }
      }).not.toThrow();
    });

    it('should handle nodes without required properties', () => {
      const rule = noMemoryLeaks.create(context);
      const incompleteNode = {
        type: 'CallExpression',
        // Missing callee
      };

      expect(() => {
        if (rule.CallExpression) {
          rule.CallExpression(incompleteNode as any);
        }
      }).not.toThrow();
    });

    it('should handle invalid setTimeout arguments', () => {
      const rule = noMemoryLeaks.create(context);
      const node = createCallExpression(createIdentifier('setTimeout'), [
        createIdentifier('callback'),
        createLiteral('not-a-number')
      ]);

      expect(() => {
        if (rule.CallExpression) {
          rule.CallExpression(node as any);
        }
      }).not.toThrow();
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(noMemoryLeaks.meta?.type).toBe('problem');
      expect(noMemoryLeaks.meta?.docs?.description).toContain('memory leak patterns');
      expect(noMemoryLeaks.meta?.schema).toEqual([]);
    });
  });
});
