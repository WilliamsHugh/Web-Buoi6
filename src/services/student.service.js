/**
 * StudentService - Xử lý logic nghiệp vụ cho Student
 * Áp dụng Dependency Injection: nhận Student model qua constructor
 */
class StudentService {
  constructor(Student) {
    this.Student = Student;
  }

  /** Tạo mới sinh viên */
  create(data) {
    return this.Student.create(data);
  }

  /**
   * Lấy danh sách sinh viên với pagination và filter theo major
   * @param {Object} query - { page, limit, major }
   */
  getAll(query) {
    const { page = 1, limit = 10, major } = query;
    const filter = { isActive: true };
    if (major) filter.major = major;

    return this.Student.find(filter)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit))
      .sort({ createdAt: -1 });
  }

  /** Đếm tổng số sinh viên (dùng cho pagination metadata) */
  countAll(query) {
    const { major } = query;
    const filter = { isActive: true };
    if (major) filter.major = major;
    return this.Student.countDocuments(filter);
  }

  /** Lấy chi tiết sinh viên theo ID */
  getById(id) {
    return this.Student.findById(id);
  }

  /** Cập nhật thông tin sinh viên */
  update(id, data) {
    return this.Student.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /** Soft delete: đánh dấu isActive = false */
  delete(id) {
    return this.Student.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }

  /** Cập nhật điểm sinh viên (chỉ field score) */
  updateScore(id, score) {
    return this.Student.findByIdAndUpdate(
      id,
      { score },
      { new: true, runValidators: true }
    );
  }

  /** Lấy top sinh viên theo điểm cao nhất */
  getTop(limit = 5) {
    return this.Student.find({ isActive: true })
      .sort({ score: -1 })
      .limit(Number(limit));
  }

  /** Tính điểm trung bình của tất cả sinh viên */
  avgScore() {
    return this.Student.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, avg: { $avg: "$score" }, total: { $sum: 1 } } },
    ]);
  }

  /** Tìm kiếm sinh viên theo tên */
  search(keyword) {
    const regex = new RegExp(keyword, "i");
    return this.Student.find({
      isActive: true,
      $or: [{ name: regex }, { studentId: regex }],
    });
  }
}

module.exports = StudentService;
