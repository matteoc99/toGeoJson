module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^@parsers$": "<rootDir>/src/parsers/index.ts",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@type/(.*)$": "<rootDir>/src/types/$1",
    "^@models/(.*)$": "<rootDir>/src/models/$1",
  },
};
