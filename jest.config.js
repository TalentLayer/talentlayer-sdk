/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/packages/client/src/**/*.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageReporters: ['json', 'lcov', 'html']
};