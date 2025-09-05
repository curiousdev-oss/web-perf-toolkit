import rule from '../../src/rules/angular-img-ngoptimizedimage';

describe('angular-img-ngoptimizedimage', () => {
  let context: any;
  let report: jest.Mock;

  beforeEach(() => {
    report = jest.fn();
    context = {
      report,
      getSourceCode: () => ({ getText: (n: any) => n.text ?? (n.quasis ? n.quasis.map((q: any) => q.value.raw).join('') : '') }),
    };
  });

  it('suggests ngSrc and width/height in template literals', () => {
    const node = createTemplateLiteral([
      '<img src="/hero.jpg" alt="" />'
    ] as any);

    const listeners = rule.create(context);
    (listeners.TemplateLiteral as any)(node);

    expect(report).toHaveBeenCalled();
    const messages = report.mock.calls.map((c: any[]) => c[0].message).join(' ');
    expect(messages).toMatch(/ngSrc/);
    expect(messages).toMatch(/width/);
  });

  it('does not report when ngSrc and dimensions present', () => {
    const node = createTemplateLiteral([
      '<img ngSrc="/hero.jpg" width="100" height="50" alt="" />'
    ] as any);

    const listeners = rule.create(context);
    (listeners.TemplateLiteral as any)(node);
    expect(report).not.toHaveBeenCalled();
  });
});


