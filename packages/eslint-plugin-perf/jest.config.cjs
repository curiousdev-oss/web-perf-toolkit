module.exports = {
  testEnvironment: "node",
  passWithNoTests: true,
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "./tsconfig.json" }],
  },
  testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
};
