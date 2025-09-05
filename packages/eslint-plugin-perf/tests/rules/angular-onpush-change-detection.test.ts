import rule from '../../src/rules/angular-onpush-change-detection';

describe('angular-onpush-change-detection', () => {
  let context: any;
  let report: jest.Mock;

  beforeEach(() => {
    report = jest.fn();
    context = {
      report,
      getSourceCode: () => ({ getText: () => '' }),
    };
  });

  it('reports when changeDetection is missing', () => {
    const cls: any = {
      type: 'ClassDeclaration',
      decorators: [
        {
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'Component' },
            arguments: [
              {
                type: 'ObjectExpression',
                properties: [
                  { key: { name: 'selector' }, value: { type: 'Literal', value: 'app-x' } },
                ],
              },
            ],
          },
        },
      ],
    };

    const listeners = rule.create(context);
    (listeners.ClassDeclaration as any)(cls);

    expect(report).toHaveBeenCalled();
    expect(report.mock.calls[0][0].message).toMatch(/OnPush/);
  });

  it('reports when changeDetection is not OnPush', () => {
    const cls: any = {
      type: 'ClassDeclaration',
      decorators: [
        {
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'Component' },
            arguments: [
              {
                type: 'ObjectExpression',
                properties: [
                  { key: { name: 'changeDetection' }, value: { type: 'Identifier', name: 'Default' } },
                ],
              },
            ],
          },
        },
      ],
    };

    const listeners = rule.create(context);
    (listeners.ClassDeclaration as any)(cls);

    expect(report).toHaveBeenCalled();
  });

  it('does not report when OnPush is set', () => {
    const cls: any = {
      type: 'ClassDeclaration',
      decorators: [
        {
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'Component' },
            arguments: [
              {
                type: 'ObjectExpression',
                properties: [
                  {
                    key: { name: 'changeDetection' },
                    value: {
                      type: 'MemberExpression',
                      object: { name: 'ChangeDetectionStrategy' },
                      property: { name: 'OnPush' },
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const listeners = rule.create(context);
    (listeners.ClassDeclaration as any)(cls);

    expect(report).not.toHaveBeenCalled();
  });
});


