import perf from "@curiousdev-oss/eslint-plugin-web-perf";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": typescriptEslint,
      "@curiousdev-oss/perf": perf,
    },
    rules: {
      ...perf.configs.angular.rules,
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
