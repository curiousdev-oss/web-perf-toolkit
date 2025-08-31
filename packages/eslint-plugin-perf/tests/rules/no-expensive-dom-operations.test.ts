import noExpensiveDomOperations from '../../src/rules/no-expensive-dom-operations';

describe('no-expensive-dom-operations', () => {
  let context: any;
  let reportSpy: jest.Mock;

  beforeEach(() => {
    reportSpy = jest.fn();
    context = {
      report: reportSpy,
      getSourceCode: () => ({
        getText: jest.fn().mockReturnValue(''),
      }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('MemberExpression - DOM Properties', () => {
    it('should report error for innerHTML usage', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createMemberExpression('element', 'innerHTML');

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: 'innerHTML' is expensive. Use textContent for text or DocumentFragment for HTML",
      });
    });

    it('should report error for outerHTML usage', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createMemberExpression('element', 'outerHTML');

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: 'outerHTML' is expensive. Use more specific DOM methods for better performance",
      });
    });

    it('should report error for getBoundingClientRect usage', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createMemberExpression('element', 'getBoundingClientRect');

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: 'getBoundingClientRect' triggers layout reflow. Cache layout values when possible - triggers reflow",
      });
    });

    it('should report error for offsetWidth usage', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createMemberExpression('element', 'offsetWidth');

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: 'offsetWidth' triggers layout reflow. Cache layout values when possible - triggers reflow",
      });
    });

    it('should report error for getComputedStyle usage', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createMemberExpression('window', 'getComputedStyle');

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: 'getComputedStyle' triggers layout reflow. Cache computed styles when possible - triggers reflow",
      });
    });

    it('should not report error for safe properties', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createMemberExpression('element', 'className');

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('MemberExpression - Style Access', () => {
    it('should report error for direct style access', () => {
      const rule = noExpensiveDomOperations.create(context);
      const styleNode = {
        type: 'MemberExpression',
        object: {
          type: 'MemberExpression',
          object: { type: 'Identifier', name: 'element' },
          property: { type: 'Identifier', name: 'style' },
        },
        property: { type: 'Identifier', name: 'color' },
      };

      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(styleNode);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node: styleNode,
        message: "WARNING: Direct style access can cause layout thrashing. Use CSS classes or batch style changes",
      });
    });
  });

  describe('Loop Context', () => {
    it('should report CRITICAL for expensive operations inside loops', () => {
      const rule = noExpensiveDomOperations.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createMemberExpression('element', 'offsetWidth');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "CRITICAL: 'offsetWidth' triggers layout reflow inside a loop. Cache layout values when possible - triggers reflow",
      });
    });

    it('should track nested loops correctly', () => {
      const rule = noExpensiveDomOperations.create(context);
      
      // Enter nested loops
      if (rule.WhileStatement) {
        rule.WhileStatement({} as any);
      }
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createMemberExpression('element', 'innerHTML');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "CRITICAL: 'innerHTML' is expensive inside a loop. Use textContent for text or DocumentFragment for HTML",
      });

      // Exit one loop
      if (rule['ForStatement:exit']) {
        rule['ForStatement:exit']({} as any);
      }

      // Should still be in loop
      const node2 = createMemberExpression('element', 'innerHTML');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node2);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node: node2,
        message: "CRITICAL: 'innerHTML' is expensive inside a loop. Use textContent for text or DocumentFragment for HTML",
      });
    });
  });

  describe('CallExpression - DOM Queries', () => {
    it('should report error for document.querySelector', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'querySelector'),
        [createLiteral('.test')]
      );

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: DOM query 'querySelector' is expensive. Cache the result",
      });
    });

    it('should report error for document.querySelectorAll', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'querySelectorAll'),
        [createLiteral('.test')]
      );

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: DOM query 'querySelectorAll' is expensive. Cache the result",
      });
    });

    it('should report error for document.getElementById', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'getElementById'),
        [createLiteral('test')]
      );

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "WARNING: DOM query 'getElementById' is expensive. Cache the result",
      });
    });

    it('should report CRITICAL for DOM queries inside loops', () => {
      const rule = noExpensiveDomOperations.create(context);
      
      // Enter a loop
      if (rule.ForOfStatement) {
        rule.ForOfStatement({} as any);
      }

      const node = createCallExpression(
        createMemberExpression('document', 'querySelector'),
        [createLiteral('.test')]
      );

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "CRITICAL: DOM query 'querySelector' inside a loop is expensive. Cache the result",
      });
    });

    it('should report error for document.write', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = createCallExpression(
        createMemberExpression('document', 'write'),
        [createLiteral('<p>test</p>')]
      );

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "CRITICAL: document.write() blocks HTML parsing. Use modern DOM methods",
      });
    });
  });

  describe('NewExpression', () => {
    it('should report error for new XMLHttpRequest', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = {
        type: 'NewExpression',
        callee: { name: 'XMLHttpRequest' },
      };

      if (rule.NewExpression) {
        (rule.NewExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Consider using fetch() API instead of XMLHttpRequest for better performance and modern standards",
      });
    });

    it('should not report error for other constructors', () => {
      const rule = noExpensiveDomOperations.create(context);
      const node = {
        type: 'NewExpression',
        callee: { name: 'Date' },
      };

      if (rule.NewExpression) {
        (rule.NewExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined nodes gracefully', () => {
      const rule = noExpensiveDomOperations.create(context);
      
      expect(() => {
        if (rule.MemberExpression) {
          rule.MemberExpression({ type: 'MemberExpression', object: null, property: null } as any);
        }
        if (rule.CallExpression) {
          rule.CallExpression({ type: 'CallExpression', callee: null } as any);
        }
      }).not.toThrow();
    });

    it('should handle nodes without required properties', () => {
      const rule = noExpensiveDomOperations.create(context);
      const incompleteNode = {
        type: 'MemberExpression',
        // Missing object and property
      };

      expect(() => {
        if (rule.MemberExpression) {
          rule.MemberExpression(incompleteNode as any);
        }
      }).not.toThrow();
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(noExpensiveDomOperations.meta?.type).toBe('suggestion');
      expect(noExpensiveDomOperations.meta?.docs?.description).toContain('expensive DOM operations');
      expect(noExpensiveDomOperations.meta?.schema).toEqual([]);
    });
  });
});
