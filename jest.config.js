module.exports = {
  // Indicates the root directory of your project.
  // This is usually where your package.json is located.
  rootDir: "./",

  // An array of file extensions your modules use.
  moduleFileExtensions: ["js", "json", "jsx", "node"],

  // A list of paths to directories that Jest should use to search for files in.
  // You can add your "src" and "tests" directories.
  roots: ["<rootDir>/src", "<rootDir>/tests"],

  // A list of regular expressions that are matched against all source file paths.
  // You can use this to ignore certain files or directories.
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],

  // A list of paths to directories that Jest should use to search for test files in.
  testMatch: ["<rootDir>/tests/**/*.test.js"],

  // A list of custom reporters for the test suite.
  // You can use this to customize test output.
  reporters: ["default"],

  // Set up global variables for your tests.
  // This can include libraries like "mongoose" and "express" if needed.
 // setupFiles: [require.resolve("<rootDir>/tests/setUp.js")],

  // Specify the test environment.
  testEnvironment: "node",

  // Set up test coverage reporting.
  // This generates code coverage reports in the "coverage" directory.
  coverageDirectory: "<rootDir>/coverage",
  collectCoverage: true,

  // You can add any other Jest configuration options here.
};
