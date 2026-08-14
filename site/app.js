// This is the tiny "app logic" - kept deliberately simple for the demo.
function greet(name) {
  if (!name || typeof name !== "string") {
    throw new Error("name must be a non-empty string");
  }
  return `Hello, ${name}! This page was built and deployed automatically by CI/CD.`;
}

// The line below lets this file work both in Node (for testing) and in the browser (for display).
if (typeof module !== "undefined") {
  module.exports = { greet };
}
