import noSyncApisInRender from '../../src/rules/no-sync-apis-in-render';

describe('no-sync-apis-in-render', () => {
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

  describe('Render Function Detection', () => {
    it('should detect React render function', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      const renderFunction = createFunctionDeclaration('render');
      
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(renderFunction);
      }

      // Use localStorage inside render
      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage.getItem' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should detect componentDidMount function', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter componentDidMount function
      const methodNode = createMethodDefinition('componentDidMount');
      
      if (rule.MethodDefinition) {
        rule.MethodDefinition(methodNode);
      }

      // Use sessionStorage inside componentDidMount
      const node = createMemberExpression('sessionStorage', 'setItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'sessionStorage.setItem' in render function 'componentDidMount'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should detect Angular ngOnInit function', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter ngOnInit function
      const propertyNode = createProperty('ngOnInit');
      
      if (rule.Property) {
        rule.Property(propertyNode);
      }

      // Use JSON.parse inside ngOnInit
      const node = createMemberExpression('JSON', 'parse');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'JSON.parse' in render function 'ngOnInit'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should not flag APIs outside render functions', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Not in a render function
      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Storage APIs', () => {
    it('should report localStorage.getItem in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage.getItem' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should report localStorage.setItem in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('localStorage', 'setItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'localStorage.setItem' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should report sessionStorage APIs in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('sessionStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'sessionStorage.getItem' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });
  });

  describe('Document APIs', () => {
    it('should report document.cookie in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('document', 'cookie');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'document.cookie' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });
  });

  describe('JSON APIs', () => {
    it('should report JSON.parse in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('JSON', 'parse');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'JSON.parse' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should report JSON.stringify in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('JSON', 'stringify');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'JSON.stringify' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });
  });

  describe('Date and Performance APIs', () => {
    it('should report Date.now in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('Date', 'now');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'Date.now' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should report performance.now in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('performance', 'now');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'performance.now' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should report Math.random in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createMemberExpression('Math', 'random');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'Math.random' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });
  });

  describe('Global Functions', () => {
    it('should report btoa in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createCallExpression(createIdentifier('btoa'), []);
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'btoa' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should report atob in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createCallExpression(createIdentifier('atob'), []);
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'atob' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should report synchronous XMLHttpRequest in render', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createCallExpression(
        createMemberExpression('xhr', 'open'),
        [createLiteral('GET'), createLiteral('/api'), createLiteral(false)]
      );
      
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalledWith({
        node,
        message: "Avoid synchronous 'XMLHttpRequest.open (synchronous)' in render function 'render'. This blocks the main thread and hurts performance. Use async alternatives or move to lifecycle methods.",
      });
    });

    it('should not report asynchronous XMLHttpRequest', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      const node = createCallExpression(
        createMemberExpression('xhr', 'open'),
        [createLiteral('GET'), createLiteral('/api'), createLiteral(true)]
      );
      
      if (rule.CallExpression) {
        (rule.CallExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Function Types', () => {
    it('should handle FunctionExpression', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function expression
      if (rule.FunctionExpression) {
        const functionExpr = {
          type: 'FunctionExpression' as const,
          body: { type: 'BlockStatement' as const, body: [] },
          params: [],
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier' as const, name: 'render' },
          parent: {} as any
        };
        rule.FunctionExpression(functionExpr);
      }

      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalled();
    });

    it('should handle ArrowFunctionExpression', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render arrow function
      if (rule.ArrowFunctionExpression) {
        const arrowFunc = {
          type: 'ArrowFunctionExpression' as const,
          body: { type: 'BlockStatement' as const, body: [] },
          params: [],
          generator: false,
          async: false,
          expression: false,
          id: { type: 'Identifier' as const, name: 'render' },
          parent: {} as any
        };
        rule.ArrowFunctionExpression(arrowFunc);
      }

      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalled();
    });

    it('should handle Property with method', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter property method
      if (rule.Property) {
        const propertyNode = createProperty('render');
        (propertyNode as any).method = true;
        rule.Property(propertyNode);
      }

      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalled();
    });

    it('should handle Property with ArrowFunctionExpression value', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter property with arrow function
      if (rule.Property) {
        rule.Property(createProperty('render', 'ArrowFunctionExpression'));
      }

      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).toHaveBeenCalled();
    });
  });

  describe('Function Exit Handling', () => {
    it('should stop flagging after exiting render function', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
      }

      // Exit render function
      if (rule['FunctionDeclaration:exit']) {
        rule['FunctionDeclaration:exit'](createFunctionDeclaration('render'));
      }

      // Should not flag after exit
      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });

    it('should handle Property exit correctly', () => {
      const rule = noSyncApisInRender.create(context);
      
      // Enter property render function
      if (rule.Property) {
        rule.Property(createProperty('render'));
      }

      // Exit property
      if (rule['Property:exit']) {
        rule['Property:exit'](createProperty('render'));
      }

      // Should not flag after exit
      const node = createMemberExpression('localStorage', 'getItem');
      if (rule.MemberExpression) {
        (rule.MemberExpression as any)(node);
      }

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined nodes gracefully', () => {
      const rule = noSyncApisInRender.create(context);
      
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
      const rule = noSyncApisInRender.create(context);
      
      // Enter render function
      if (rule.FunctionDeclaration) {
        rule.FunctionDeclaration(createFunctionDeclaration('render'));
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

    it('should handle functions without names', () => {
      const rule = noSyncApisInRender.create(context);
      
      const functionNode = {
        type: 'FunctionDeclaration' as const,
        id: { type: 'Identifier' as const, name: '' }, // anonymous function with empty name
        body: { type: 'BlockStatement' as const, body: [] },
        params: [],
        generator: false,
        async: false,
        expression: false,
        parent: {} as any
      };

      expect(() => {
        if (rule.FunctionDeclaration) {
          rule.FunctionDeclaration(functionNode);
        }
      }).not.toThrow();

      expect(reportSpy).not.toHaveBeenCalled();
    });
  });

  describe('Rule Metadata', () => {
    it('should have correct metadata', () => {
      expect(noSyncApisInRender.meta?.type).toBe('problem');
      expect(noSyncApisInRender.meta?.docs?.description).toContain('synchronous APIs in render functions');
      expect(noSyncApisInRender.meta?.schema).toEqual([]);
    });
  });
});
