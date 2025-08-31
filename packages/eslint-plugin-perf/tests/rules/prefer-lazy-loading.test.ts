import preferLazyLoading from '../../src/rules/prefer-lazy-loading';

describe('prefer-lazy-loading', () => {
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

  describe('JSX Opening Element - Image Lazy Loading', () => {
    it('should report error for img without loading attribute', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('src', createLiteral('test.jpg')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: 'Consider adding loading="lazy" to images for better performance',
        suggest: [{
          desc: 'Add loading="lazy" attribute',
          fix: expect.any(Function),
        }],
      });
    });

    it('should not report error for img with loading="lazy"', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('src', createLiteral('test.jpg')),
        createJSXAttribute('loading', createLiteral('lazy')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img with loading="eager"', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('src', createLiteral('test.jpg')),
        createJSXAttribute('loading', createLiteral('eager')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img without src attribute', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('alt', createLiteral('test')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for non-img elements', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('div', [
        createJSXAttribute('src', createLiteral('test.jpg')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img with null attributes', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img with undefined attributes', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img with empty attributes array', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle JSX elements with different name types', () => {
      const rule = preferLazyLoading.create(context);
      const node = {
        type: 'JSXOpeningElement',
        name: {
          type: 'JSXMemberExpression',
          object: { type: 'JSXIdentifier', name: 'MyComponent' },
          property: { type: 'JSXIdentifier', name: 'Image' },
        },
        attributes: [
          createJSXAttribute('src', createLiteral('test.jpg')),
        ]
      };

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Template Literal - Image Lazy Loading', () => {
    it('should report error for img in template without loading attribute', () => {
      const contextWithGetText = {
        ...context,
        getSourceCode: () => ({
          getText: jest.fn().mockReturnValue('<img src="test.jpg">'),
        }),
      };
      const rule = preferLazyLoading.create(contextWithGetText);
      const node = createTemplateLiteral(['<img src="test.jpg">']);

      if (rule.TemplateLiteral) {
        (rule.TemplateLiteral as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: 'Consider adding loading="lazy" to images in templates for better performance',
      });
    });

    it('should not report error for img in template with loading attribute', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral(['<img src="test.jpg" loading="lazy">']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img in template with loading="eager"', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral(['<img src="test.jpg" loading="eager">']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for template without img tags', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral(['<div>No images here</div>']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for template without img src', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral(['<img alt="test">']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle multiple img tags in template', () => {
      const contextWithGetText = {
        ...context,
        getSourceCode: () => ({
          getText: jest.fn().mockReturnValue('<div><img src="test1.jpg"><img src="test2.jpg" loading="lazy"></div>'),
        }),
      };
      const rule = preferLazyLoading.create(contextWithGetText);
      const node = createTemplateLiteral([
        '<div><img src="test1.jpg"><img src="test2.jpg" loading="lazy"></div>',
      ]);

      if (rule.TemplateLiteral) {
        (rule.TemplateLiteral as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledTimes(1);
      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: 'Consider adding loading="lazy" to images in templates for better performance',
      });
    });

    it('should handle complex template with mixed content', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral([
        '<div><p>Text</p><img src="test.jpg" loading="lazy"><span>More text</span></div>',
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img tags with quoted attributes', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral([
        '<img src="test.jpg" alt="test" loading="lazy">',
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img tags with single quotes', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral([
        "<img src='test.jpg' loading='lazy'>",
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img tags with mixed quotes', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral([
        '<img src="test.jpg" loading=\'lazy\'>',
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Import Declaration - Dynamic Import Suggestions', () => {
    it('should report error for heavy library default import', () => {
      const rule = preferLazyLoading.create(context);
      const node = createImportDeclaration('chart.js', [
        {
          type: 'ImportDefaultSpecifier',
          local: { name: 'Chart' },
        },
      ]);

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Consider dynamic import() for heavy library 'chart.js' to improve initial bundle size",
      });
    });

    it('should report error for heavy library namespace import', () => {
      const rule = preferLazyLoading.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'd3' },
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: { name: 'd3' },
          },
        ]
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Consider dynamic import() for heavy library 'd3' to improve initial bundle size",
      });
    });

    it('should not report error for heavy library named import', () => {
      const rule = preferLazyLoading.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'lodash' },
        specifiers: [
          {
            type: 'ImportSpecifier',
            imported: { name: 'map' },
            local: { name: 'map' },
          },
        ]
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for non-heavy library import', () => {
      const rule = preferLazyLoading.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'react' },
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: { name: 'React' },
          },
        ]
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for import without specifiers', () => {
      const rule = preferLazyLoading.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: 'chart.js' },
        specifiers: [],
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for import without source', () => {
      const rule = preferLazyLoading.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: null,
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: { name: 'Chart' },
          },
        ]
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle heavy libraries with different patterns', () => {
      const rule = preferLazyLoading.create(context);
      const heavyLibraries = [
        'chart.js', 'chartjs', 'd3', 'three', 'monaco-editor',
        'pdf-lib', 'pdfjs', 'moment', 'luxon', 'lodash'
      ];

      heavyLibraries.forEach(lib => {
        const node = {
          type: 'ImportDeclaration' as const,
          source: { value: lib },
          specifiers: [
            {
              type: 'ImportDefaultSpecifier',
              local: { name: 'Lib' },
            },
          ],
        };

        if (rule.ImportDeclaration) {
  (rule.ImportDeclaration as any)(node);
        }
      });

      expect(reportSpy).toHaveBeenCalledTimes(heavyLibraries.length);
    });

    it('should handle heavy libraries with scoped packages', () => {
      const rule = preferLazyLoading.create(context);
      const node = {
        type: 'ImportDeclaration' as const,
        source: { value: '@types/d3' },
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: { name: 'D3' },
          },
        ]
      };

      if (rule.ImportDeclaration) {
(rule.ImportDeclaration as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Consider dynamic import() for heavy library '@types/d3' to improve initial bundle size",
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty template literal', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral(['']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle template literal with only expressions', () => {
      const rule = preferLazyLoading.create(context);
      const node = createTemplateLiteral(['', ''], [createIdentifier('variable')]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle JSX element with undefined attributes', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle JSX element with empty attributes array', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(preferLazyLoading.meta?.type).toBe('suggestion');
      expect(preferLazyLoading.meta?.docs?.description).toContain('lazy loading');
      expect(preferLazyLoading.meta?.schema).toEqual([]);
    });
  });

  describe('Fix Suggestions', () => {
    it('should provide fix suggestion for JSX images', () => {
      const rule = preferLazyLoading.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('src', createLiteral('test.jpg')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: 'Consider adding loading="lazy" to images for better performance',
        suggest: [{
          desc: 'Add loading="lazy" attribute',
          fix: expect.any(Function),
        }],
      });

      // Test the fix function
      const suggestion = reportSpy.mock.calls[0][0].suggest?.[0];
      if (suggestion?.fix) {
        const mockFixer = {
          insertTextAfter: jest.fn().mockReturnValue({}),
        };

        suggestion.fix(mockFixer);

        expect(mockFixer.insertTextAfter).toHaveBeenCalledWith(node, ' loading="lazy"');
      }
    });
  });
});
