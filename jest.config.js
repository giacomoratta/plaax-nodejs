module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/__tests__/(*.)+(spec|test).[jt]s?(x)'
    // '**/__tests__/**/*.[jt]s?(x)',
    // '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],

  // Specifies the memory limit for workers before they are recycled and is primarily a work-around for a
  // well-known issue for jest and node16. After the worker has executed a test the memory usage of it is checked.
  // If it exceeds the value specified the worker is killed and restarted.
  workerIdleMemoryLimit: '512MB',

  // The maximum amount of workers used to run your tests. Can be specified as % or a number.
  // E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number.
  // maxWorkers: 2 will use a maximum of 2 workers.
  maxWorkers: "45%",
}
