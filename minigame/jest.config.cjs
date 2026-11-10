module.exports = {
  testEnvironment: "node",
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },
  testMatch: ["**/src/unittest/**/*.spec.js"],
};
