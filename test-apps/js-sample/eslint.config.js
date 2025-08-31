import perf from "@curiousdev-oss/eslint-plugin-web-perf";

export default [
  {
    files: ["**/*.js"],
    plugins: {
      "@curiousdev-oss/perf": perf,
    },
    rules: {
      ...perf.configs.recommended.rules,
    },
  },
];
