module.exports = {
  testEnvironment: 'node',
  // The glob patterns Jest uses to detect test files
  testMatch: [
    // '**/__tests__/**/*/*.[jt]s?(x)',
    '**/__tests__/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\', '\\\\config\\\\']
};