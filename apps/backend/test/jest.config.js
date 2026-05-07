const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
    "^.+\\.(t|j)s$": "ts-jest",
  },
  moduleNameMapper: {
    "^@1/(.*)$": "<rootDir>/src/v1/$1",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "../",
  testRegex: "\\.test\\.ts$",
  extensionsToTreatAsEsm: [".ts"],
  collectCoverageFrom: ["src/**/*.(t|j)s"],
  modulePathIgnorePatterns: ["<rootDir>/bad-fockarch/"],
};
