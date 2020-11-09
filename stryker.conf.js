/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: 'npm',
  reporters: ['html'],
  testRunner: 'jest',
  coverageAnalysis: 'off',
  mutate: ['controller/**/*.js'],
  thresholds: { high: 95, low: 85, break: 56 },
  timeoutMs: 60 * 1000,
  timeoutFactor: 4,
  maxConcurrentTestRunners: 6
};
