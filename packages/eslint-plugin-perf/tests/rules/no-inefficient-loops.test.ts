import noInefficientLoops from '../../src/rules/no-inefficient-loops';

describe('no-inefficient-loops', () => {
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

  describe('DOM Queries in Loops', () => {
    it('should report error for document.querySelector in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createMemberExpression('document', 'querySelector');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'document.querySelector' inside loops. Cache DOM queries outside loops",
      });
    });

    it('should report error for document.querySelectorAll in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.WhileStatement) {
        rule.WhileStatement({} as any);
      }

      const node = createMemberExpression('document', 'querySelectorAll');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'document.querySelectorAll' inside loops. Cache DOM queries outside loops",
      });
    });

    it('should report error for document.getElementById in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForInStatement) {
        rule.ForInStatement({} as any);
      }

      const node = createMemberExpression('document', 'getElementById');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'document.getElementById' inside loops. Cache DOM queries outside loops",
      });
    });

    it('should report error for document.getElementsByClassName in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForOfStatement) {
        rule.ForOfStatement({} as any);
      }

      const node = createMemberExpression('document', 'getElementsByClassName');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'document.getElementsByClassName' inside loops. Cache DOM queries outside loops",
      });
    });

    it('should report error for document.getElementsByTagName in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.DoWhileStatement) {
        rule.DoWhileStatement({} as any);
      }

      const node = createMemberExpression('document', 'getElementsByTagName');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'document.getElementsByTagName' inside loops. Cache DOM queries outside loops",
      });
    });

    it('should not report error for DOM queries outside loops', () => {
      const rule = noInefficientLoops.create(context);

      const node = createMemberExpression('document', 'querySelector');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Console Statements in Loops', () => {
    it('should report error for console.log in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createMemberExpression('console', 'log');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid console.log inside loops. Remove or use conditional logging",
      });
    });

    it('should not report error for console.log outside loops', () => {
      const rule = noInefficientLoops.create(context);

      const node = createMemberExpression('console', 'log');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('JSON Operations in Loops', () => {
    it('should report error for JSON.parse in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createMemberExpression('JSON', 'parse');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'JSON.parse' inside loops. Cache parsed objects outside loops",
      });
    });

    it('should report error for JSON.stringify in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.WhileStatement) {
        rule.WhileStatement({} as any);
      }

      const node = createMemberExpression('JSON', 'stringify');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'JSON.stringify' inside loops. Cache serialized strings outside loops",
      });
    });
  });

  describe('Array Methods in Loops', () => {
    it('should report error for array.map in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createCallExpression(
        createMemberExpression('array', 'map'),
        []
      );
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid array.map() inside loops. Cache the result or move outside the loop",
      });
    });

    it('should report error for array.filter in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createCallExpression(
        createMemberExpression('array', 'filter'),
        []
      );
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid array.filter() inside loops. Cache the result or move outside the loop",
      });
    });

    it('should report error for array.reduce in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createCallExpression(
        createMemberExpression('array', 'reduce'),
        []
      );
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid array.reduce() inside loops. Cache the result or move outside the loop",
      });
    });

    it('should report error for array.sort in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createCallExpression(
        createMemberExpression('array', 'sort'),
        []
      );
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid array.sort() inside loops. Cache the result or move outside the loop",
      });
    });

    it('should report error for array.slice in loop', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createCallExpression(
        createMemberExpression('array', 'slice'),
        []
      );
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid array.slice() inside loops. Cache the result or move outside the loop",
      });
    });

    it('should not report error for safe array methods', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

      const node = createCallExpression(
        createMemberExpression('array', 'push'),
        []
      );
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Loop Depth Tracking', () => {
    it('should track nested loops correctly', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter nested loops
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }
      if (rule.WhileStatement) {
        rule.WhileStatement({} as any);
      }

      const node = createMemberExpression('document', 'querySelector');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid 'document.querySelector' inside loops. Cache DOM queries outside loops",
      });

      // Exit one loop
      if (rule['WhileStatement:exit']) {
        rule['WhileStatement:exit']({} as any);
      }

      // Should still be in a loop
      const node2 = createMemberExpression('document', 'querySelector');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node2);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node: node2,
        message: "Avoid 'document.querySelector' inside loops. Cache DOM queries outside loops",
      });

      // Exit last loop
      if (rule['ForStatement:exit']) {
        rule['ForStatement:exit']({} as any);
      }

      // Should not report outside loops
      const node3 = createMemberExpression('document', 'querySelector');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node3);
      }

      // Should have been called only twice (for the two times inside loops)
      expect(reportSpy).toHaveBeenCalledTimes(2);
    });

    it('should handle all loop types', () => {
      const rule = noInefficientLoops.create(context);
      
      const loopTypes = [
        'ForStatement',
        'ForInStatement', 
        'ForOfStatement',
        'WhileStatement',
        'DoWhileStatement'
      ];

      loopTypes.forEach(loopType => {
        if (rule[loopType]) {
          (rule[loopType] as any)({} as any);
        }

        const node = createMemberExpression('console', 'log');
        if (rule.MemberExpression) {
          (rule.MemberExpression as any)(node);
        }

        if (rule[`${loopType}:exit`]) {
          (rule[`${loopType}:exit`] as any)({} as any);
        }
      });

      expect(reportSpy).toHaveBeenCalledTimes(loopTypes.length);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined nodes gracefully', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }
      
      expect(() => {
        if (rule.MemberExpression) {
          rule.MemberExpression(null as any);
        }
        if (rule.CallExpression) {
          rule.CallExpression(undefined as any);
        }
      }).not.toThrow();
    });

    it('should handle nodes without required properties', () => {
      const rule = noInefficientLoops.create(context);
      
      // Enter a loop
      if (rule.ForStatement) {
        rule.ForStatement({} as any);
      }

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
      expect(noInefficientLoops.meta?.type).toBe('suggestion');
      expect(noInefficientLoops.meta?.docs?.description).toContain('performance-damaging patterns inside loops');
      expect(noInefficientLoops.meta?.schema).toEqual([]);
    });
  });
});
