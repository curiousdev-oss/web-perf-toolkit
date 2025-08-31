import noLargeBundleImports from '../../src/rules/no-large-bundle-imports';

describe('no-large-bundle-imports', () => {
  let context: any;
  let reportSpy: jest.Mock;

  beforeEach(() => {
    reportSpy = jest.fn();
    context = {
      report: reportSpy,
      getSourceCode: () => ({
        getText: jest.fn().mockReturnValue(''),
      }),
      options: [],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('ImportDeclaration - Large Libraries', () => {
    it('should report error for moment import', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('moment', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'moment' (300KB) detected. Consider: date-fns or native Intl",
      });
    });

    it('should report error for lodash import', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('lodash', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'lodash' (100KB) detected. Consider: tree-shake specific functions or native methods",
      });
    });

    it('should report error for jquery import', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('jquery', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'jquery' (85KB) detected. Consider: native DOM APIs or modern frameworks",
      });
    });

    it('should report error for three.js import', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('three', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'three' (600KB) detected. Consider: dynamic import for 3D features",
      });
    });

    it('should report warning for medium-sized libraries', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('axios', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'axios' (50KB) detected. Consider: native fetch() API",
      });
    });

    it('should not report error for small libraries', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('react', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('ImportDeclaration - Namespace Imports', () => {
    it('should report error for namespace import of large library', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('lodash', [{
        type: 'ImportNamespaceSpecifier',
        local: { name: '_' }
      }]);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Namespace import from 'lodash' imports the entire library. Use specific imports to enable tree-shaking.",
      });
    });

    it('should not report error for named imports', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('lodash', [{
        type: 'ImportSpecifier',
        imported: { name: 'debounce' },
        local: { name: 'debounce' }
      }]);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      // Should still report the large library warning, but not the namespace warning
      expect(reportSpy).toHaveBeenCalledTimes(1);
      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'lodash' (100KB) detected. Consider: tree-shake specific functions or native methods",
      });
    });
  });

  describe('ImportDeclaration - Default Imports', () => {
    it('should report error for default import of lodash', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('lodash', [{
        type: 'ImportDefaultSpecifier',
        local: { name: '_' }
      }]);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Default import from 'lodash' may import the entire library. Use specific named imports for better tree-shaking.",
      });
    });

    it('should report error for default import of moment', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('moment', [{
        type: 'ImportDefaultSpecifier',
        local: { name: 'moment' }
      }]);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Default import from 'moment' may import the entire library. Use specific named imports for better tree-shaking.",
      });
    });

    it('should not report default import error for safe libraries', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('react', [{
        type: 'ImportDefaultSpecifier',
        local: { name: 'React' }
      }]);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Scoped Packages', () => {
    it('should handle Angular Material correctly', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('@angular/material', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library '@angular/material' (200KB) detected. Consider: tree-shake specific components",
      });
    });

    it('should handle Angular animations', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('@angular/animations', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library '@angular/animations' (50KB) detected. Consider: CSS animations for simple cases",
      });
    });

    it('should handle sub-imports correctly', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('@angular/material/button', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library '@angular/material' (200KB) detected. Consider: tree-shake specific components",
      });
    });
  });

  describe('CallExpression - require() calls', () => {
    it('should report error for require lodash', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createCallExpression(createIdentifier('require'), [
        createLiteral('lodash')
      ]);

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'lodash' (100KB) detected. Consider: tree-shake specific functions or native methods",
      });
    });

    it('should not report error for non-require calls', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createCallExpression(createIdentifier('someFunction'), [
        createLiteral('lodash')
      ]);

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle require without arguments', () => {
      const rule = noLargeBundleImports.create(context);
      const node = createCallExpression(createIdentifier('require'), []);

      expect(() => {
        if (rule.CallExpression) {
          (rule.CallExpression as any)(node);
        }
      }).not.toThrow();

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Dynamic Imports', () => {
    it('should provide positive feedback for dynamic imports', () => {
      const rule = noLargeBundleImports.create(context);
      const node = {
        type: 'ImportExpression',
        source: {
          type: 'Literal',
          value: 'three'
        }
      };

      if (rule.ImportExpression) {
        (rule.ImportExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Good! Dynamic import of 'three' helps keep initial bundle size small.",
      });
    });

    it('should not report for dynamic imports of unknown libraries', () => {
      const rule = noLargeBundleImports.create(context);
      const node = {
        type: 'ImportExpression',
        source: {
          type: 'Literal',
          value: 'unknown-lib'
        }
      };

      if (rule.ImportExpression) {
        (rule.ImportExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Export All Declarations', () => {
    it('should report error for re-exporting large libraries', () => {
      const rule = noLargeBundleImports.create(context);
      const node = {
        type: 'ExportAllDeclaration',
        source: { value: 'lodash' }
      };

      if (rule.ExportAllDeclaration) {
        (rule.ExportAllDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Re-exporting all from 'lodash' prevents tree-shaking. Export specific items instead.",
      });
    });
  });

  describe('Template Literals', () => {
    it('should provide positive feedback for dynamic imports in templates', () => {
      const rule = noLargeBundleImports.create(context);
      context.getSourceCode = () => ({
        getText: jest.fn().mockReturnValue('`import("three")`'),
      });

      const node = createTemplateLiteral(['import("three")']);

      if (rule.TemplateLiteral) {
        (rule.TemplateLiteral as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Good practice: Dynamic import of 'three' in template helps performance.",
      });
    });
  });

  describe('Configuration Options', () => {
    it('should respect custom maxSize option', () => {
      context.options = [{ maxSize: 200 }];
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('lodash', []); // 100KB

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      // Should show as medium-sized since 100KB < 200KB
      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Medium-sized library 'lodash' (100KB). Ensure tree-shaking: tree-shake specific functions or native methods",
      });
    });

    it('should respect allowedLarge option', () => {
      context.options = [{ allowedLarge: ['lodash'] }];
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('lodash', []);

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should respect custom warnThreshold option', () => {
      context.options = [{ warnThreshold: 100 }];
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('axios', []); // 50KB

      if (rule.ImportDeclaration) {
        (rule.ImportDeclaration as any)(node);
      }

      // Should still warn as large since 50KB >= 50KB default maxSize
      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Large library 'axios' (50KB) detected. Consider: native fetch() API",
      });
    });

    it('should handle empty options', () => {
      context.options = [];
      const rule = noLargeBundleImports.create(context);
      const node = createImportDeclaration('lodash', []);

      expect(() => {
        if (rule.ImportDeclaration) {
          (rule.ImportDeclaration as any)(node);
        }
      }).not.toThrow();

      expect(reportSpy).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle imports without source', () => {
      const rule = noLargeBundleImports.create(context);
      const node = { type: 'ImportDeclaration', source: null };

      expect(() => {
        if (rule.ImportDeclaration) {
          rule.ImportDeclaration(node as any);
        }
      }).not.toThrow();
    });

    it('should handle malformed import expressions', () => {
      const rule = noLargeBundleImports.create(context);
      const node = {
        type: 'ImportExpression',
        source: { type: 'Identifier', name: 'dynamic' }
      };

      expect(() => {
        if (rule.ImportExpression) {
          rule.ImportExpression(node as any);
        }
      }).not.toThrow();
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(noLargeBundleImports.meta?.type).toBe('suggestion');
      expect(noLargeBundleImports.meta?.docs?.description).toContain('large libraries');
      expect(noLargeBundleImports.meta?.schema).toHaveLength(1);
    });
  });
});
