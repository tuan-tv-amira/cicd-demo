// Đây là "logic ứng dụng" — cố tình viết cực đơn giản để demo dễ hiểu.
function greet(name) {
  if (!name || typeof name !== "string") {
    throw new Error("name phải là 1 chuỗi không rỗng");
  }
  return `Xin chào, ${name}! Trang này được build và deploy tự động bởi CI/CD.`;
}

// Dòng dưới giúp file này dùng được cả trong Node (để test) và trong trình duyệt (để hiển thị).
if (typeof module !== "undefined") {
  module.exports = { greet };
}
