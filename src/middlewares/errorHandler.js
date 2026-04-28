/**
 * errorHandler middleware - Global error handler
 * Xử lý lỗi tập trung toàn bộ hệ thống
 */
module.exports = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Lỗi duplicate key (unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Trường '${field}' đã tồn tại, vui lòng dùng giá trị khác`,
    });
  }

  // Lỗi validation Mongoose
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: messages,
    });
  }

  // Lỗi CastError (sai kiểu dữ liệu)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Giá trị không hợp lệ cho trường '${err.path}'`,
    });
  }

  // Lỗi mặc định
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Lỗi máy chủ nội bộ",
  });
};
