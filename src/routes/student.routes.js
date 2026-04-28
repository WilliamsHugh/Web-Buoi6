const router = require("express").Router();
const { controller } = require("../container");
const validateId = require("../middlewares/validateObjectId");

// ============================================================
// API nâng cao (đặt TRƯỚC route có :id để tránh conflict)
// ============================================================

/**
 * @swagger
 * /api/students/top:
 *   get:
 *     summary: Lấy top sinh viên theo điểm cao nhất
 *     tags: [Advanced]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Số lượng sinh viên muốn lấy
 *     responses:
 *       200:
 *         description: Danh sách top sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 */
router.get("/top", controller.top);

/**
 * @swagger
 * /api/students/stats/avg:
 *   get:
 *     summary: Tính điểm trung bình của tất cả sinh viên
 *     tags: [Advanced]
 *     responses:
 *       200:
 *         description: Thống kê điểm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     avgScore:
 *                       type: number
 *                       example: 78.5
 *                     totalStudents:
 *                       type: integer
 *                       example: 20
 */
router.get("/stats/avg", controller.avg);

/**
 * @swagger
 * /api/students/search:
 *   get:
 *     summary: Tìm kiếm sinh viên theo tên
 *     tags: [Advanced]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm (tên hoặc mã sinh viên)
 *         example: nguyen
 *     responses:
 *       200:
 *         description: Kết quả tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       400:
 *         description: Thiếu từ khóa tìm kiếm
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/search", controller.search);

// ============================================================
// CRUD cơ bản
// ============================================================

/**
 * @swagger
 * tags:
 *   - name: CRUD
 *     description: Các thao tác CRUD cơ bản với sinh viên
 *   - name: Advanced
 *     description: API nâng cao (top, stats/avg, search)
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Tạo sinh viên mới
 *     tags: [CRUD]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *           examples:
 *             sv1:
 *               summary: Sinh viên IT
 *               value:
 *                 studentId: "SV001"
 *                 name: "Nguyễn Văn An"
 *                 email: "an.nguyen@email.com"
 *                 score: 85
 *                 major: "IT"
 *             sv2:
 *               summary: Sinh viên Business
 *               value:
 *                 studentId: "SV002"
 *                 name: "Trần Thị Bình"
 *                 email: "binh.tran@email.com"
 *                 score: 72
 *                 major: "Business"
 *     responses:
 *       201:
 *         description: Tạo sinh viên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Tạo sinh viên thành công
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc studentId/email trùng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/", controller.create);

/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Lấy danh sách sinh viên (có pagination + filter theo major)
 *     tags: [CRUD]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Số sinh viên mỗi trang
 *       - in: query
 *         name: major
 *         schema:
 *           type: string
 *           enum: [IT, Business, Design, Marketing]
 *         description: Lọc theo ngành học
 *     responses:
 *       200:
 *         description: Danh sách sinh viên với thông tin pagination
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedStudents'
 */
router.get("/", controller.getAll);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Lấy chi tiết một sinh viên
 *     tags: [CRUD]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của sinh viên
 *         example: 664a1b2c3d4e5f6789abcdef
 *     responses:
 *       200:
 *         description: Chi tiết sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/:id", validateId, controller.getOne);

/**
 * @swagger
 * /api/students/{id}:
 *   put:
 *     summary: Cập nhật toàn bộ thông tin sinh viên
 *     tags: [CRUD]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của sinh viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cập nhật sinh viên thành công
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: ID không hợp lệ hoặc dữ liệu sai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put("/:id", validateId, controller.update);

/**
 * @swagger
 * /api/students/{id}/score:
 *   patch:
 *     summary: Cập nhật điểm sinh viên (chỉ field score)
 *     tags: [CRUD]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của sinh viên
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [score]
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 90
 *                 description: Điểm mới (0 – 100)
 *     responses:
 *       200:
 *         description: Cập nhật điểm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Cập nhật điểm thành công
 *                 data:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Điểm không hợp lệ (ngoài khoảng 0-100) hoặc ID sai
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.patch("/:id/score", validateId, controller.updateScore);

/**
 * @swagger
 * /api/students/{id}:
 *   delete:
 *     summary: Xóa mềm sinh viên (soft delete — isActive = false)
 *     tags: [CRUD]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId của sinh viên
 *     responses:
 *       204:
 *         description: Xóa thành công (không có body)
 *       400:
 *         description: ID không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Không tìm thấy sinh viên
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete("/:id", validateId, controller.delete);

module.exports = router;
