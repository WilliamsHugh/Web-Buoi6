const mongoose = require("mongoose");

/**
 * validateObjectId middleware
 * Kiểm tra id có phải MongoDB ObjectId hợp lệ trước khi xử lý request
 */
module.exports = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "ID không hợp lệ (phải là MongoDB ObjectId)",
    });
  }
  next();
};
