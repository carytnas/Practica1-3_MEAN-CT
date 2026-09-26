/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': '@swc/jest',
  },
  testMatch: ['**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // ESM imports use .js extensions — strip them so Jest can find the .ts files
  moduleNameMapper: {
    '^(\\.{1,2}/.+)\\.js$': '$1',
  },
};
