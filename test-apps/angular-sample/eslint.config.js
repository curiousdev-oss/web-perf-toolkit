import perf from "@web-perf-toolkit/eslint-plugin-perf";
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
      "@web-perf-toolkit/perf": perf,
    },
    rules: {
      ...perf.configs.angular.rules,
      "@typescript-eslint/no-unused-vars": "error",
    },
  },
];
