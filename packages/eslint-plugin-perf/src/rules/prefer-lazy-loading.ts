import type { Rule } from "eslint";

const rule: Rule.RuleModule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Encourage lazy loading for images and components to improve initial page load",
    },
    schema: [],
  },
  create(context) {
    function checkImageLazyLoading(node: any, attributes: any[]) {
      const attrs = new Map<string, any>();
      for (const attr of attributes || []) {
        if (attr.name) {
          attrs.set(attr.name, attr);
        }
      }
      
      const hasLoading = attrs.has("loading");
      const hasSrc = attrs.has("src");
      
      if (hasSrc && !hasLoading) {
        context.report({
          node,
          message: "Consider adding loading=\"lazy\" to images for better performance",
          suggest: [{
            desc: "Add loading=\"lazy\" attribute",
            fix(fixer: any) {
              // Simple fix suggestion for JSX
              return fixer.insertTextAfter(node, ' loading="lazy"');
            }
          }]
        });
      }
    }
    
    return {
      // JSX images
      JSXOpeningElement(node: any) {
        if (node.name?.type === "JSXIdentifier" && node.name.name === "img") {
          const attrs = node.attributes?.map((a: any) => ({
            name: a.name?.name,
            value: a.value
          })) || [];
          checkImageLazyLoading(node, attrs);
        }
      },
      
      // Template literals (Angular, lit-html)
      TemplateLiteral(node: any) {
        const source = context.getSourceCode().getText(node);
        const imgMatches = source.match(/<img[^>]*src[^>]*>/g);
        
        if (imgMatches) {
          for (const imgTag of imgMatches) {
            if (!imgTag.includes('loading=')) {
              context.report({
                node,
                message: "Consider adding loading=\"lazy\" to images in templates for better performance",
              });
            }
          }
        }
      },
      
      // Dynamic imports - encourage for large modules
      ImportDeclaration(node: any) {
        const source = node.source?.value as string;
        if (!source) return;
        
        // Check for large libraries that should be dynamically imported
        const heavyLibraries = [
          'chart.js', 'chartjs', 'd3', 'three', 'monaco-editor', 
          'pdf-lib', 'pdfjs', 'moment', 'luxon', 'lodash'
        ];
        
        const isHeavyLibrary = heavyLibraries.some(lib => 
          source.includes(lib) || source.startsWith(lib)
        );
        
        if (isHeavyLibrary && node.specifiers?.length > 0) {
          // Check if it's a default or namespace import (likely heavy)
          const hasHeavyImport = node.specifiers.some((spec: any) => 
            spec.type === "ImportDefaultSpecifier" || 
            spec.type === "ImportNamespaceSpecifier"
          );
          
          if (hasHeavyImport) {
            context.report({
              node,
              message: `Consider dynamic import() for heavy library '${source}' to improve initial bundle size`,
            });
          }
        }
      },
    };
  },
};

export default rule;
