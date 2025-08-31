import noHeavyNamespaceImports from '../../src/rules/no-heavy-namespace-imports';

describe('no-heavy-namespace-imports', () => {
  let context: any;
  let reportSpy: jest.Mock;

  beforeEach(() => {
    reportSpy = jest.fn();
    context = {
      report: reportSpy,
      options: [],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ImportDeclaration with default deny list', () => {
    it('should report error for lodash namespace import', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = createImportDeclaration('lodash', [
        {
          type: 'ImportNamespaceSpecifier',
          local: { name: '_' },
        },
      ]);

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'lodash'. Import specific modules or use lighter alternatives.",
      });
    });

    it('should report error for moment namespace import', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'moment' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: 'moment' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'moment'. Import specific modules or use lighter alternatives.",
      });
    });

    it('should not report error for lodash named import', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportSpecifier',
            imported: { name: 'map' },
            local: { name: 'map' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for moment named import', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'moment' },
        specifiers: [
          {
            type: 'ImportSpecifier',
            imported: { name: 'format' },
            local: { name: 'format' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for non-heavy package namespace import', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'react' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: 'React' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for non-heavy package named import', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'react' },
        specifiers: [
          {
            type: 'ImportSpecifier',
            imported: { name: 'useState' },
            local: { name: 'useState' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('ImportDeclaration with custom deny list', () => {
    it('should report error for custom denied package namespace import', () => {
      context.options = [{ deny: ['rxjs', 'chart.js'] }];
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'rxjs' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: 'rxjs' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'rxjs'. Import specific modules or use lighter alternatives.",
      });
    });

    it('should not report error for lodash when not in custom deny list', () => {
      context.options = [{ deny: ['rxjs', 'chart.js'] }];
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for moment when not in custom deny list', () => {
      context.options = [{ deny: ['rxjs', 'chart.js'] }];
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'moment' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: 'moment' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle empty deny list', () => {
      context.options = [{ deny: [] }];
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('ImportDeclaration with no options', () => {
    it('should use default deny list when no options provided', () => {
      context.options = [];
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'lodash'. Import specific modules or use lighter alternatives.",
      });
    });

    it('should use default deny list when options is undefined', () => {
      context.options = undefined;
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'moment' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: 'moment' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'moment'. Import specific modules or use lighter alternatives.",
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle import without source', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: null,
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      expect(() => {
        if (rule.ImportDeclaration) {
          rule.ImportDeclaration(node as any);
        }
      }).not.toThrow();
      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle import without specifiers', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: null,
      };

      expect(() => {
        if (rule.ImportDeclaration) {
          rule.ImportDeclaration(node as any);
        }
      }).not.toThrow();
      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle import with empty specifiers array', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [],
      };

      expect(() => {
        if (rule.ImportDeclaration) {
          rule.ImportDeclaration(node as any);
        }
      }).not.toThrow();
      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle import with no namespace specifier', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle import with mixed specifiers', () => {
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportSpecifier',
            imported: { name: 'map' },
            local: { name: 'map' },
          },
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'lodash'. Import specific modules or use lighter alternatives.",
      });
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(noHeavyNamespaceImports.meta?.type).toBe('problem');
      expect(noHeavyNamespaceImports.meta?.docs?.description).toContain('heavy namespace imports');
      expect(noHeavyNamespaceImports.meta?.schema).toHaveLength(1);
      const schema = Array.isArray(noHeavyNamespaceImports.meta?.schema) 
        ? noHeavyNamespaceImports.meta.schema[0] 
        : noHeavyNamespaceImports.meta?.schema;
      expect(schema?.type).toBe('object');
      expect(schema?.properties?.deny).toBeDefined();
      expect((schema?.properties?.deny as any)?.type).toBe('array');
      expect((schema?.properties?.deny as any)?.items?.type).toBe('string');
      expect(schema?.additionalProperties).toBe(false);
    });
  });

  describe('Configuration Options', () => {
    it('should handle malformed options gracefully', () => {
      context.options = [null];
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      expect(() => {
        if (rule.ImportDeclaration) {
  (rule.ImportDeclaration as any)(node);
        }
      }).not.toThrow();
      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'lodash'. Import specific modules or use lighter alternatives.",
      });
    });

    it('should handle options with missing deny property', () => {
      context.options = [{}];
      const rule = noHeavyNamespaceImports.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: '_' },
          },
        ],
        attributes: [], // Required for ESLint 9 compatibility
      };

      expect(() => {
        if (rule.ImportDeclaration) {
  (rule.ImportDeclaration as any)(node);
        }
      }).not.toThrow();
      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid namespace import from 'lodash'. Import specific modules or use lighter alternatives.",
      });
    });
  });
});
