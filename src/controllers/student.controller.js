/**
 * StudentController - Xử lý HTTP request/response cho Student
 * Áp dụng Dependency Injection: nhận service qua constructor
 */
class StudentController {
  constructor(service) {
    this.service = service;
  }

  /**
   * POST /api/students
   * Tạo mới sinh viên
   */
  create = async (req, res, next) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({
        success: true,
        message: "Tạo sinh viên thành công",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/students?page=1&limit=10&major=IT
   * Lấy danh sách sinh viên có pagination và filter theo major
   */
  getAll = async (req, res, next) => {
    try {
      const { page = 1, limit = 10 } = req.query;

      const [students, total] = await Promise.all([
        this.service.getAll(req.query),
        this.service.countAll(req.query),
      ]);

      res.json({
        success: true,
        data: students,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/students/:id
   * Lấy chi tiết sinh viên
   */
  getOne = async (req, res, next) => {
    try {
      const data = await this.service.getById(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sinh viên",
        });
      }
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  /**
   * PUT /api/students/:id
   * Cập nhật thông tin sinh viên
   */
  update = async (req, res, next) => {
    try {
      const data = await this.service.update(req.params.id, req.body);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sinh viên",
        });
      }
      res.json({
        success: true,
        message: "Cập nhật sinh viên thành công",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * PATCH /api/students/:id/score
   * Cập nhật điểm sinh viên - chỉ field score, validate 0-100
   */
  updateScore = async (req, res, next) => {
    try {
      const { score } = req.body;

      // Trả về 400 nếu dữ liệu không hợp lệ
      if (score === undefined || score === null) {
        return res.status(400).json({
          success: false,
          message: "Trường score là bắt buộc",
        });
      }
      if (typeof score !== "number" || score < 0 || score > 100) {
        return res.status(400).json({
          success: false,
          message: "Điểm số phải là số trong khoảng 0 - 100",
        });
      }

      // Trả về 404 nếu không tìm thấy sinh viên
      const data = await this.service.updateScore(req.params.id, score);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sinh viên",
        });
      }

      res.json({
        success: true,
        message: "Cập nhật điểm thành công",
        data,
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * DELETE /api/students/:id
   * Xóa mềm (soft delete): isActive = false
   */
  delete = async (req, res, next) => {
    try {
      const data = await this.service.delete(req.params.id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy sinh viên",
        });
      }
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/students/top?limit=5
   * Lấy top sinh viên theo điểm cao nhất
   */
  top = async (req, res, next) => {
    try {
      const data = await this.service.getTop(req.query.limit);
      res.json({ success: true, data });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/students/stats/avg
   * Tính điểm trung bình và tổng số sinh viên
   */
  avg = async (req, res, next) => {
    try {
      const result = await this.service.avgScore();
      const stats = result[0] || { avg: 0, total: 0 };
      res.json({
        success: true,
        data: {
          avgScore: Math.round(stats.avg * 100) / 100,
          totalStudents: stats.total,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  /**
   * GET /api/students/search?q=keyword
   * Tìm kiếm sinh viên theo tên
   */
  search = async (req, res, next) => {
    try {
      const { q } = req.query;
      if (!q || q.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập từ khóa tìm kiếm",
        });
      }
      const data = await this.service.search(q.trim());
      res.json({ success: true, total: data.length, data });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = StudentController;
