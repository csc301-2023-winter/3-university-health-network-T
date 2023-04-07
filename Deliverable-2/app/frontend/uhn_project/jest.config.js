module.exports = {
    transform: {
      "^.+\\.(js|jsx|mjs|cjs|ts|tsx)$": "@jest/transform",
    },
    testEnvironment: "jsdom",
    moduleNameMapper: {
      "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  };
  