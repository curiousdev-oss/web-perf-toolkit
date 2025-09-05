import perf from "../../packages/eslint-plugin-perf/dist/src/index.js";
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
        project: true,
        tsconfigRootDir: "/Users/gunnerwhocodes/development/web-perf-toolkit/test-apps/angular-sample",
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
