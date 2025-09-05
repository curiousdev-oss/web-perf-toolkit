import rule from '../../src/rules/angular-require-trackby';

describe('angular-require-trackby', () => {
  let context: any;
  let report: jest.Mock;

  beforeEach(() => {
    report = jest.fn();
    context = {
      report,
      getSourceCode: () => ({ getText: (n: any) => n.text ?? (n.quasis ? n.quasis.map((q: any) => q.value.raw).join('') : '') }),
    };
  });

  it('reports when *ngFor lacks trackBy', () => {
    const node = createTemplateLiteral([
      '<div *ngFor="let item of items">{{item}}</div>'
    ] as any);

    const listeners = rule.create(context);
    (listeners.TemplateLiteral as any)(node);

    expect(report).toHaveBeenCalled();
  });

  it('does not report when trackBy is present', () => {
    const node = createTemplateLiteral([
      '<div *ngFor="let item of items; trackBy: trackId">{{item}}</div>'
    ] as any);

    const listeners = rule.create(context);
    (listeners.TemplateLiteral as any)(node);

    expect(report).not.toHaveBeenCalled();
  });
});


