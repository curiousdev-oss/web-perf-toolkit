import { rules, configs } from '../src/index';

describe('ESLint Plugin Index', () => {
  describe('Rules Export', () => {
    it('should export all 18 performance rules', () => {
      expect(Object.keys(rules)).toHaveLength(18);
    });

    it('should export the correct rule names', () => {
      const expectedRules = [
        'img-requires-dimensions',
        'no-heavy-namespace-imports',
        'no-blocking-apis',
        'no-inefficient-loops',
        'prefer-lazy-loading',
        'no-memory-leaks',
        'no-expensive-dom-operations',
        'prefer-efficient-data-structures',
        'no-sync-apis-in-render',
        'prefer-modern-apis',
        'no-large-bundle-imports',
        'prefer-web-vitals-optimizations',
        'no-render-blocking-resources',
        'prefer-resource-hints',
        'angular-onpush-change-detection',
        'angular-require-trackby',
        'angular-prefer-async-pipe',
        'angular-img-ngoptimizedimage',
      ];

      expectedRules.forEach(ruleName => {
        expect(rules[ruleName]).toBeDefined();
        expect(typeof rules[ruleName]).toBe('object');
        expect(rules[ruleName]!.meta).toBeDefined();
        expect(rules[ruleName]!.create).toBeDefined();
      });
    });

    it('should have valid rule metadata', () => {
      Object.values(rules).forEach(rule => {
        expect(rule.meta).toBeDefined();
        expect(rule.meta!.type).toBeDefined();
        expect(rule.meta!.docs).toBeDefined();
        expect(rule.meta!.docs!.description).toBeDefined();
        expect(typeof rule.meta!.docs!.description).toBe('string');
        expect(rule.meta!.docs!.description!.length).toBeGreaterThan(0);
      });
    });

    it('should have valid rule create functions', () => {
      Object.values(rules).forEach(rule => {
        expect(typeof rule.create).toBe('function');
        const mockContext = {
          report: jest.fn(),
          getSourceCode: () => ({ getText: jest.fn() }),
          options: []
        };
        const ruleContext = rule.create(mockContext as any);
        expect(typeof ruleContext).toBe('object');
      });
    });
  });

  describe('Configs Export', () => {
    it('should export recommended, strict, and angular configs', () => {
      expect(configs.recommended).toBeDefined();
      expect(configs.strict).toBeDefined();
      expect(configs.angular).toBeDefined();
    });

    it('should have valid recommended config structure', () => {
      const recommended = configs.recommended;
      expect(recommended.plugins).toEqual(['@curiousdev-oss/perf']);
      expect(recommended.rules).toBeDefined();
      expect(Object.keys(recommended.rules || {}).length).toBeGreaterThan(0);
    });

    it('should have valid strict config structure', () => {
      const strict = configs.strict;
      expect(strict.plugins).toEqual(['@curiousdev-oss/perf']);
      expect(strict.rules).toBeDefined();
      expect(Object.keys(strict.rules || {}).length).toBeGreaterThan(0);
    });

    it('should have valid angular config structure', () => {
      const angular = configs.angular;
      expect(angular.plugins).toEqual(['@curiousdev-oss/perf']);
      expect(angular.rules).toBeDefined();
      expect(Object.keys(angular.rules || {}).length).toBeGreaterThan(0);
    });

    it('should have consistent rule configurations across configs', () => {
      const ruleNames = Object.keys(rules);
      
      ruleNames.forEach(ruleName => {
        const fullRuleName = `@curiousdev-oss/perf/${ruleName}`;
        
        // Check if rule exists in recommended and angular configs
        expect(configs.recommended.rules?.[fullRuleName]).toBeDefined();
        expect(configs.angular.rules?.[fullRuleName]).toBeDefined();
        
        // All rules should be in strict config now
        expect(configs.strict.rules?.[fullRuleName]).toBeDefined();
      });
    });

    it('should have stricter rules in strict config than recommended', () => {
      const ruleNames = Object.keys(rules);
      
      ruleNames.forEach(ruleName => {
        const fullRuleName = `@curiousdev-oss/perf/${ruleName}`;
        const recommended = configs.recommended.rules?.[fullRuleName];
        const strict = configs.strict.rules?.[fullRuleName];
        
        // Strict config should have error level for most rules
        if (Array.isArray(strict)) {
          expect(strict[0]).toBe('error');
        } else {
          expect(strict).toBe('error');
        }
      });
    });

    it('should have angular-specific configurations', () => {
      const angular = configs.angular;
      const largeBundleRule = angular.rules?.['@curiousdev-oss/perf/no-large-bundle-imports'];
      
      expect(Array.isArray(largeBundleRule)).toBe(true);
      if (Array.isArray(largeBundleRule) && largeBundleRule[1]) {
        expect(largeBundleRule[1]).toHaveProperty('maxSize');
        expect(largeBundleRule[1]).toHaveProperty('allowedLarge');
        expect((largeBundleRule[1] as any).allowedLarge).toContain('@angular/core');
        expect((largeBundleRule[1] as any).allowedLarge).toContain('@angular/common');
      }
    });
  });

  describe('Default Export', () => {
    it('should export rules and configs as default', async () => {
      const defaultExport = await import('../src/index');
      expect(defaultExport.default).toBeDefined();
      expect(defaultExport.default.rules).toBeDefined();
      expect(defaultExport.default.configs).toBeDefined();
    });
  });

  describe('Rule Implementation', () => {
    it('should have working rule implementations', () => {
      Object.entries(rules).forEach(([ruleName, rule]) => {
        const mockContext = {
          report: jest.fn(),
          getSourceCode: () => ({
            getText: jest.fn().mockReturnValue(''),
          }),
          getFilename: () => 'test.js',
          options: []
        } as any;

        const ruleContext = rule.create(mockContext);
        expect(typeof ruleContext).toBe('object');
        
        // Test that the rule context has the expected structure
        if (ruleName === 'img-requires-dimensions') {
          expect(ruleContext.JSXOpeningElement).toBeDefined();
          expect(ruleContext.TemplateLiteral).toBeDefined();
        } else if (ruleName === 'no-blocking-apis') {
          expect(ruleContext.MemberExpression).toBeDefined();
          expect(ruleContext.CallExpression).toBeDefined();
        }
      });
    });
  });
});
