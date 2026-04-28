const mongoose = require("mongoose");

/**
 * studentSchema - Model sinh viên với các trường dữ liệu:
 * - studentId     : Mã sinh viên (String, unique, required)
 * - name          : Họ tên sinh viên (String, required)
 * - email         : Email sinh viên (String, required, unique)
 * - score         : Điểm số (Number, min 0, max 100, default 0)
 * - major         : Ngành học (enum: IT, Business, Design, Marketing)
 * - enrollmentDate: Ngày nhập học (Date, default: Date.now)
 * - isActive      : Trạng thái sinh viên (Boolean, default: true)
 */
const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, "Mã sinh viên là bắt buộc"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Họ tên sinh viên là bắt buộc"],
      trim: true,
      minlength: [2, "Họ tên phải có ít nhất 2 ký tự"],
      maxlength: [100, "Họ tên không được vượt quá 100 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Email sinh viên là bắt buộc"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    score: {
      type: Number,
      default: 0,
      min: [0, "Điểm không được nhỏ hơn 0"],
      max: [100, "Điểm không được lớn hơn 100"],
    },
    major: {
      type: String,
      required: [true, "Ngành học là bắt buộc"],
      enum: {
        values: ["IT", "Business", "Design", "Marketing"],
        message: "Ngành học phải là: IT, Business, Design, Marketing",
      },
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
