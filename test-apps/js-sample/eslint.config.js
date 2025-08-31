import perf from "@web-perf-toolkit/eslint-plugin-perf";

export default [
  {
    files: ["**/*.js"],
    plugins: {
      "@web-perf-toolkit/perf": perf,
    },
    rules: {
      ...perf.configs.recommended.rules,
    },
  },
];
