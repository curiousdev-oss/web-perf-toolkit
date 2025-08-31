import { ESLint } from 'eslint';

// Mock ESLint for testing
jest.mock('eslint', () => ({
  ESLint: jest.fn().mockImplementation(() => ({
    lint: jest.fn(),
    lintText: jest.fn(),
  })),
}));

// Global test utilities
global.createESLintContext = (options: any = {}) => {
  const defaultContext = {
    getSourceCode: () => ({
      getText: (node: any) => node?.text || '',
      getTokens: () => [],
      getTokensBetween: () => [],
      getFirstToken: () => null,
      getLastToken: () => null,
      getNodeByRangeIndex: () => null,
      getAllComments: () => [],
      getCommentsBefore: () => [],
      getCommentsAfter: () => [],
      getCommentsInside: () => [],
      getJSDocComment: () => null,
      isSpaceBetweenTokens: () => false,
      getFirstTokenBetween: () => null,
      getLastTokenBetween: () => null,
      getTokenByRangeStart: () => null,
      getTokenByRangeEnd: () => null,
    }),
    report: jest.fn(),
    getFilename: () => 'test.js',
    getCwd: () => '/test',
    getScope: () => ({
      variables: [],
      references: [],
      through: [],
      set: new Map(),
      defs: new Map(),
      taints: new Set(),
      block: null,
      functionExpressionScope: false,
      isStrict: false,
      upper: null,
      isBlock: false,
      isFunction: false,
      isGlobal: false,
      isModule: false,
      isClass: false,
      isSwitch: false,
      isFor: false,
      isBlockBoundary: false,
      isVar: false,
      isClassFieldInitializer: false,
      isClassStaticBlock: false,
      isTopLevelScope: false,
      isStrictBlock: false,
      isStrictFunction: false,
      isStrictModule: false,
      isStrictClass: false,
      isStrictSwitch: false,
      isStrictFor: false,
      isStrictBlockBoundary: false,
      isStrictVar: false,
      isStrictClassFieldInitializer: false,
      isStrictClassStaticBlock: false,
      isStrictTopLevelScope: false,
      isStrictStrictBlock: false,
      isStrictStrictFunction: false,
      isStrictStrictModule: false,
      isStrictStrictClass: false,
      isStrictStrictSwitch: false,
      isStrictStrictFor: false,
      isStrictStrictBlockBoundary: false,
      isStrictStrictVar: false,
      isStrictStrictClassFieldInitializer: false,
      isStrictStrictClassStaticBlock: false,
      isStrictStrictTopLevelScope: false,
    }),
    getDeclaredVariables: () => [],
    getAncestors: () => [],
    getMarkVariableAsUsed: jest.fn(),
    markVariableAsUsed: jest.fn(),
    markScopeAsUsed: jest.fn(),
    getSourceLines: () => [],
  };

  return { ...defaultContext, ...options };
};

// Mock AST node creators
global.createJSXOpeningElement = (name: string, attributes: any[] = []) => ({
  type: 'JSXOpeningElement',
  name: {
    type: 'JSXIdentifier',
    name,
  },
  attributes,
  selfClosing: false,
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

global.createJSXAttribute = (name: string, value: any = null) => ({
  type: 'JSXAttribute',
  name: {
    type: 'JSXIdentifier',
    name,
  },
  value,
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

global.createLiteral = (value: string | number | boolean) => ({
  type: 'Literal',
  value,
  raw: String(value),
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

global.createTemplateLiteral = (quasis: string[], expressions: any[] = []) => ({
  type: 'TemplateLiteral',
  quasis: quasis.map((quasi, index) => ({
    type: 'TemplateElement',
    value: { raw: quasi, cooked: quasi },
    tail: index === quasis.length - 1,
    range: [0, 10],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
  })),
  expressions,
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

global.createMemberExpression = (object: string, property: string) => ({
  type: 'MemberExpression' as const,
  object: { type: 'Identifier' as const, name: object },
  property: { type: 'Identifier' as const, name: property },
  computed: false,
  optional: false,
  range: [0, 10] as [number, number],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

global.createCallExpression = (callee: any, args: any[] = []) => ({
  type: 'CallExpression' as const,
  callee,
  arguments: args,
  optional: false,
  range: [0, 10] as [number, number],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

global.createIdentifier = (name: string) => ({
  type: 'Identifier',
  name,
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

global.createFunctionDeclaration = (name: string) => ({
  type: 'FunctionDeclaration',
  id: { type: 'Identifier', name },
  body: { type: 'BlockStatement', body: [] },
  params: [],
  generator: false,
  async: false,
  expression: false,
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
  parent: {} as any, // Mock parent to satisfy NodeParentExtension
});

global.createMethodDefinition = (name: string) => ({
  type: 'MethodDefinition',
  key: { type: 'Identifier', name },
  value: { 
    type: 'FunctionExpression', 
    body: { type: 'BlockStatement', body: [] }, 
    params: [],
    generator: false,
    async: false,
    expression: false,
    id: null,
  },
  kind: 'method',
  computed: false,
  static: false,
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
  parent: {} as any, // Mock parent to satisfy NodeParentExtension
});

global.createProperty = (name: string, valueType: string = 'FunctionExpression') => ({
  type: 'Property',
  key: { type: 'Identifier', name },
  value: { 
    type: valueType, 
    body: { type: 'BlockStatement', body: [] }, 
    params: [],
    generator: false,
    async: false,
    expression: false,
    id: null,
  },
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false,
  range: [0, 10],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
  parent: {} as any, // Mock parent to satisfy NodeParentExtension
});

// Mock AST nodes for ImportDeclaration
global.createImportDeclaration = (source: string, specifiers: any[] = []) => ({
  type: 'ImportDeclaration' as const,
  source: { value: source },
  specifiers: specifiers.map(spec => ({
    ...spec,
    type: spec.type as any,
  })),
  attributes: [], // Add required attributes property
  range: [0, 10] as [number, number],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 10 } },
});

// Test helper to create a mock context
global.createMockContext = (options: any = {}) => {
  const mockReport = jest.fn();
  const mockGetSourceCode = jest.fn().mockReturnValue({
    getText: jest.fn().mockReturnValue(''),
  });

  return {
    report: mockReport,
    getSourceCode: mockGetSourceCode,
    getFilename: jest.fn().mockReturnValue('test.js'),
    options: [],
    ...options,
  };
};

// Helper to safely call rule functions that might have type mismatches
global.callRuleFunction = (ruleFunction: any, node: any) => {
  try {
    // Call with just the node, which is what our rules expect
    return ruleFunction(node);
  } catch (error) {
    throw error;
  }
};

// Extend global types
declare global {
  var createESLintContext: (options?: any) => any;
  var createJSXOpeningElement: (name: string, attributes?: any[]) => any;
  var createJSXAttribute: (name: string, value?: any) => any;
  var createLiteral: (value: string | number | boolean) => any;
  var createTemplateLiteral: (quasis: string[], expressions?: any[]) => any;
  var createMemberExpression: (object: string, property: string) => any;
  var createCallExpression: (callee: any, args?: any[]) => any;
  var createIdentifier: (name: string) => any;
  var createImportDeclaration: (source: string, specifiers?: any[]) => any;
  var createMockContext: (options?: any) => any;
  var callRuleFunction: (ruleFunction: any, node: any) => any;
  var createFunctionDeclaration: (name: string) => any;
  var createMethodDefinition: (name: string) => any;
  var createProperty: (name: string, valueType?: string) => any;
}
