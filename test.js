// A trivially simple test - no dependencies to install (uses Node's built-in "assert" module).
// This IS the "CI" step: automatically checking the code is correct before deploy is allowed.
const assert = require("node:assert");
const { greet } = require("./site/app.js");

assert.strictEqual(
  greet("Amira"),
  "Hello, Amira! This page was built and deployed automatically by CI/CD."
);

assert.throws(() => greet(""), /name must be a non-empty string/);
assert.throws(() => greet(null), /name must be a non-empty string/);

console.log("✅ All tests passed!");
