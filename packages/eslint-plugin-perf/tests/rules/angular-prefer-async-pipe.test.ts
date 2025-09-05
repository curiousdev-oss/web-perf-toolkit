import rule from '../../src/rules/angular-prefer-async-pipe';

describe('angular-prefer-async-pipe', () => {
  let context: any;
  let report: jest.Mock;

  beforeEach(() => {
    report = jest.fn();
    context = {
      report,
      getSourceCode: () => ({ getText: () => '' }),
    };
  });

  function createAngularClassWithMember(member: any) {
    return {
      type: 'ClassDeclaration',
      decorators: [
        {
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'Component' },
            arguments: [{ type: 'ObjectExpression', properties: [] }],
          },
        },
      ],
      body: { body: [member] },
    } as any;
  }

  it('reports subscribe() within Angular component class', () => {
    const listeners = rule.create(context);
    const method = {
      type: 'MethodDefinition',
      key: { name: 'ngOnInit' },
      value: { type: 'FunctionExpression', body: { body: [] } },
    } as any;

    const cls = createAngularClassWithMember(method);
    (listeners.ClassDeclaration as any)(cls);

    const subscribeMember = { type: 'MemberExpression', property: { name: 'subscribe' }, parent: { type: 'CallExpression' } } as any;
    (listeners.MemberExpression as any)(subscribeMember);

    expect(report).toHaveBeenCalled();
  });

  it('does not report outside Angular class', () => {
    const listeners = rule.create(context);
    const subscribeMember = { type: 'MemberExpression', property: { name: 'subscribe' }, parent: { type: 'CallExpression' } } as any;
    (listeners.MemberExpression as any)(subscribeMember);
    expect(report).not.toHaveBeenCalled();
  });
});


