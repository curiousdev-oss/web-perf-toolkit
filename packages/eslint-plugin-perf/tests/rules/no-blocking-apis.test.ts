import noBlockingApis from '../../src/rules/no-blocking-apis';

describe('no-blocking-apis', () => {
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

  describe('MemberExpression', () => {
    it('should report error for window.localStorage', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('window', 'localStorage');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should report error for window.sessionStorage', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('window', 'sessionStorage');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'sessionStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should report error for document.cookie', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('document', 'cookie');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'document.cookie' which blocks the main thread. Use async cookie libraries or cache cookies",
      });
    });

    it('should report error for direct localStorage access', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('localStorage', 'getItem');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should report error for direct sessionStorage access', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('sessionStorage', 'setItem');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'sessionStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should report error for JSON.parse', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('JSON', 'parse');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'JSON.parse' which blocks the main thread. Consider streaming JSON parsers for large data",
      });
    });

    it('should report error for JSON.stringify', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('JSON', 'stringify');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'JSON.stringify' which blocks the main thread. Consider streaming JSON serializers for large data",
      });
    });

    it('should not report error for non-blocking APIs', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('console', 'log');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for custom object properties', () => {
      const rule = noBlockingApis.create(context);
      const node = createMemberExpression('myObject', 'property');

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle computed properties', () => {
      const rule = noBlockingApis.create(context);
      const node = {
        type: 'MemberExpression' as const,
        object: { type: 'Identifier', name: 'window' },
        property: { type: 'Identifier', name: 'localStorage' },
        computed: true,
        optional: false,
        range: [0, 10],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
      };

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should handle optional chaining', () => {
      const rule = noBlockingApis.create(context);
      const node = {
        type: 'MemberExpression' as const,
        object: { type: 'Identifier', name: 'window' },
        property: { type: 'Identifier', name: 'localStorage' },
        computed: false,
        optional: true,
        range: [0, 10],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
      };

      if (rule.MemberExpression) {
(rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });
  });

  describe('CallExpression', () => {
    it('should report error for direct localStorage.getItem() call', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('localStorage'), []);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should report error for direct sessionStorage.setItem() call', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('sessionStorage'), []);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'sessionStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should report error for direct alert() call', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('alert'), []);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'alert' which blocks the main thread. Use toast notifications or modal dialogs",
      });
    });

    it('should report error for direct confirm() call', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('confirm'), []);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'confirm' which blocks the main thread. Use async modal confirmations",
      });
    });

    it('should report error for direct prompt() call', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('prompt'), []);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'prompt' which blocks the main thread. Use form inputs or async modal prompts",
      });
    });

    it('should report error for direct JSON.parse() call', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(
        createMemberExpression('JSON', 'parse'),
        []
      );

      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'JSON.parse' which blocks the main thread. Consider streaming JSON parsers for large data",
      });
    });

    it('should not report error for non-blocking function calls', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('console'), []);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should not report error for custom function calls', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('myFunction'), []);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle function calls with arguments', () => {
      const rule = noBlockingApis.create(context);
      const node = createCallExpression(createIdentifier('localStorage'), [
        createLiteral('key'),
        createLiteral('value'),
      ]);

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });

    it('should handle optional function calls', () => {
      const rule = noBlockingApis.create(context);
      const node = {
        type: 'CallExpression' as const,
        callee: createIdentifier('localStorage'),
        arguments: [],
        optional: true,
        range: [0, 10],
        loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
      };

      if (rule.CallExpression) {
(rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage' which blocks the main thread. Use async storage or cache the value",
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined nodes gracefully', () => {
      const rule = noBlockingApis.create(context);
      
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
      const rule = noBlockingApis.create(context);
      const incompleteNode = {
        type: 'MemberExpression' as const,
        // Missing object and property
      };

      expect(() => {
        if (rule.MemberExpression) {
          rule.MemberExpression(incompleteNode as any);
        }
      }).not.toThrow();
    });

    it('should handle nodes with malformed properties', () => {
      const rule = noBlockingApis.create(context);
      const malformedNode = {
        type: 'MemberExpression' as const,
        object: null,
        property: { type: 'Identifier', name: 'localStorage' },
      };

      expect(() => {
        if (rule.MemberExpression) {
          rule.MemberExpression(malformedNode as any);
        }
      }).not.toThrow();
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(noBlockingApis.meta?.type).toBe('suggestion');
      expect(noBlockingApis.meta?.docs?.description).toContain('synchronous/blocking APIs');
      expect(noBlockingApis.meta?.schema).toEqual([]);
      expect(noBlockingApis.meta?.fixable).toBe('code');
    });
  });

  describe('Blocking APIs Constants', () => {
    it('should contain all expected blocking APIs', () => {
      const rule = noBlockingApis.create(context);
      
      // Test that the rule handles all blocking APIs
      const blockingAPIs = [
        'localStorage',
        'sessionStorage',
        'document.cookie',
        'alert',
        'confirm',
        'prompt',
        'execSync',
        'readFileSync',
        'writeFileSync',
        'mkdirSync',
        'rmSync',
        'statSync',
        'JSON.parse',
        'JSON.stringify',
      ];

      blockingAPIs.forEach(apiName => {
        if (apiName.includes('.')) {
          const [obj, prop] = apiName.split('.');
          const node = createMemberExpression(obj, prop);
          if (rule.MemberExpression) {
    (rule.MemberExpression as any)(node);
          }
        } else {
          const node = createCallExpression(createIdentifier(apiName), []);
          if (rule.CallExpression) {
    (rule.CallExpression as any)(node);
          }
        }
      });

      // Should have reported all blocking APIs
      expect(reportSpy).toHaveBeenCalledTimes(blockingAPIs.length);
    });
  });

  describe('Async Alternatives Suggestions', () => {
    it('should provide helpful suggestions for each blocking API', () => {
      const rule = noBlockingApis.create(context);
      
      // Test localStorage
      const localStorageNode = createMemberExpression('window', 'localStorage');
      if (rule.MemberExpression) {
        rule.MemberExpression(localStorageNode);
      }
      
      expect(reportSpy).toHaveBeenCalledWith({
        node: localStorageNode,
        message: expect.stringContaining('Use async storage or cache the value'),
      });

      // Test alert
      const alertNode = createCallExpression(createIdentifier('alert'), []);
      if (rule.CallExpression) {
        rule.CallExpression(alertNode);
      }
      
      expect(reportSpy).toHaveBeenCalledWith({
        node: alertNode,
        message: expect.stringContaining('Use toast notifications or modal dialogs'),
      });

      // Test JSON.parse
      const jsonParseNode = createMemberExpression('JSON', 'parse');
      if (rule.MemberExpression) {
        rule.MemberExpression(jsonParseNode);
      }
      
      expect(reportSpy).toHaveBeenCalledWith({
        node: jsonParseNode,
        message: expect.stringContaining('Consider streaming JSON parsers for large data'),
      });
    });
  });
});
