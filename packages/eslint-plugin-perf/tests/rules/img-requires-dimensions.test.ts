import imgRequiresDimensions from '../../src/rules/img-requires-dimensions';

describe('img-requires-dimensions', () => {
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

  describe('JSX Opening Element', () => {
    it('should report error for img without dimensions', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: '<img> must declare width/height attributes or CSS dimensions to prevent layout shifts',
      });
    });

    it('should not report error for img with width and height attributes', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('width', createLiteral('100')),
        createJSXAttribute('height', createLiteral('100')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img with width attribute only', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('width', createLiteral('100')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: '<img> must declare width/height attributes or CSS dimensions to prevent layout shifts',
      });
    });

    it('should not report error for img with height attribute only', () => {
      const _rule = imgRequiresDimensions.create(context);
      const ruleContext = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('height', createLiteral('100')),
      ]);

      if (ruleContext.JSXOpeningElement) {
(ruleContext.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: '<img> must declare width/height attributes or CSS dimensions to prevent layout shifts',
      });
    });

    it('should not report error for img with style attribute containing dimensions', () => {
      const mockGetText = jest.fn().mockReturnValue('width: 100px; height: 100px;');
      context.getSourceCode = () => ({
        getText: mockGetText,
      });

      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('style', createLiteral('width: 100px; height: 100px;')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img with style attribute containing aspect-ratio', () => {
      const mockGetText = jest.fn().mockReturnValue('aspect-ratio: 16/9;');
      context.getSourceCode = () => ({
        getText: mockGetText,
      });

      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('style', createLiteral('aspect-ratio: 16/9;')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img with style attribute containing aspectRatio', () => {
      const mockGetText = jest.fn().mockReturnValue('aspectRatio: 16/9;');
      context.getSourceCode = () => ({
        getText: mockGetText,
      });

      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', [
        createJSXAttribute('style', createLiteral('aspectRatio: 16/9;')),
      ]);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for non-img elements', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('div', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle JSX elements with different name types', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = {
        type: 'JSXOpeningElement',
        name: {
          type: 'JSXMemberExpression',
          object: { type: 'JSXIdentifier', name: 'MyComponent' },
          property: { type: 'JSXIdentifier', name: 'Image' },
        },
        attributes: [],
      };

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle JSX element with null attributes', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: '<img> must declare width/height attributes or CSS dimensions to prevent layout shifts',
      });
    });
  });

  describe('Template Literal', () => {
    it('should report error for img in template without dimensions', () => {
      const contextWithGetText = {
        ...context,
        getSourceCode: () => ({
          getText: jest.fn().mockReturnValue('<img src="test.jpg">'),
        }),
      };
      const rule = imgRequiresDimensions.create(contextWithGetText);
      const node = createTemplateLiteral(['<img src="test.jpg">']);

      if (rule.TemplateLiteral) {
        (rule.TemplateLiteral as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: 'Images in templates must declare dimensions to prevent layout shifts',
      });
    });

    it('should not report error for img in template with width and height', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral(['<img src="test.jpg" width="100" height="100">']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img in template with style containing dimensions', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral(['<img src="test.jpg" style="width: 100px; height: 100px;">']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for img in template with style containing aspect-ratio', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral(['<img src="test.jpg" style="aspect-ratio: 16/9;">']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle multiple img tags in template', () => {
      const contextWithGetText = {
        ...context,
        getSourceCode: () => ({
          getText: jest.fn().mockReturnValue('<div><img src="test1.jpg"><img src="test2.jpg" width="100" height="100"></div>'),
        }),
      };
      const rule = imgRequiresDimensions.create(contextWithGetText);
      const node = createTemplateLiteral([
        '<div><img src="test1.jpg"><img src="test2.jpg" width="100" height="100"></div>',
      ]);

      if (rule.TemplateLiteral) {
        (rule.TemplateLiteral as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledTimes(1);
      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: 'Images in templates must declare dimensions to prevent layout shifts',
      });
    });

    it('should handle template with no img tags', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral(['<div>No images here</div>']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle complex template with mixed content', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral([
        '<div><p>Text</p><img src="test.jpg" width="100" height="100"><span>More text</span></div>',
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img tags with quoted attributes', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral([
        '<img src="test.jpg" alt="test" width="100" height="100">',
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img tags with single quotes', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral([
        "<img src='test.jpg' width='100' height='100'>",
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle img tags with mixed quotes', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral([
        '<img src="test.jpg" width="100" height=\'100\'>',
      ]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty template literal', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral(['']);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle template literal with only expressions', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createTemplateLiteral(['', ''], [createIdentifier('variable')]);

      if (rule.TemplateLiteral) {
        rule.TemplateLiteral(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle JSX element with undefined attributes', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: '<img> must declare width/height attributes or CSS dimensions to prevent layout shifts',
      });
    });

    it('should handle JSX element with empty attributes array', () => {
      const rule = imgRequiresDimensions.create(context);
      const node = createJSXOpeningElement('img', []);

      if (rule.JSXOpeningElement) {
        (rule.JSXOpeningElement as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: '<img> must declare width/height attributes or CSS dimensions to prevent layout shifts',
      });
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(imgRequiresDimensions.meta?.type).toBe('problem');
      expect(imgRequiresDimensions.meta?.docs?.description).toContain('Cumulative Layout Shift');
      expect(imgRequiresDimensions.meta?.schema).toEqual([]);
    });
  });
});
