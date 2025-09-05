module.exports = {
  testEnvironment: "node",
  passWithNoTests: true,
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  transform: {
    "^.+\\.(t|j)sx?$": ["ts-jest", { 
      tsconfig: "./tsconfig.json",
      useESM: true
    }],
  },
  preset: 'ts-jest/presets/default-esm',
  testMatch: ["<rootDir>/tests/**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    // Map ESM .js extensions in source to .ts for ts-jest during tests
    '^\\./rules/(.*)\\.js$': '<rootDir>/src/rules/$1.ts'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,js}",
    "!src/**/*.d.ts",
    "!src/**/index.ts"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 45,
      lines: 45,
      statements: 45
    }
  },
  testTimeout: 10000,
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
  extensionsToTreatAsEsm: [".ts"]
};
