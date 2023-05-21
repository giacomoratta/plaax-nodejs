module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/(*.)+(spec|test).[jt]s?(x)'
    // '**/__tests__/**/*.[jt]s?(x)',
    // '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  setupFiles: ['<rootDir>/.jest/setEnvVars.js']
}
