// Test cực đơn giản, không cần cài thư viện gì (dùng module "assert" có sẵn của Node.js).
// Đây chính là bước "CI" - kiểm tra tự động code có đúng không trước khi cho deploy.
const assert = require("node:assert");
const { greet } = require("./site/app.js");

assert.strictEqual(
  greet("Amira"),
  "Xin chào, Amira! Trang này được build và deploy tự động bởi CI/CD."
);

assert.throws(() => greet(""), /name phải là 1 chuỗi không rỗng/);
assert.throws(() => greet(null), /name phải là 1 chuỗi không rỗng/);

console.log("✅ Tất cả test đều pass!");
