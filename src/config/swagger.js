const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "🎓 Student API",
      version: "1.0.0",
      description:
        "REST API quản lý sinh viên — Bài tập Web Buổi 6\n\n" +
        "**Các tính năng:**\n" +
        "- CRUD cơ bản với pagination & filter theo major\n" +
        "- Soft delete (isActive = false)\n" +
        "- PATCH cập nhật điểm (validate 0 – 100, trả về 400/404)\n" +
        "- API nâng cao: top sinh viên, điểm trung bình, tìm kiếm theo tên",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    components: {
      schemas: {
        // ── Request body ─────────────────────────────────────
        StudentInput: {
          type: "object",
          required: ["studentId", "name", "email", "major"],
          properties: {
            studentId: {
              type: "string",
              example: "SV001",
              description: "Mã sinh viên (unique, tự động uppercase)",
            },
            name: {
              type: "string",
              example: "Nguyễn Văn An",
              description: "Họ tên sinh viên (2–100 ký tự)",
            },
            email: {
              type: "string",
              format: "email",
              example: "an.nguyen@email.com",
              description: "Email sinh viên (unique)",
            },
            score: {
              type: "number",
              minimum: 0,
              maximum: 100,
              default: 0,
              example: 85,
              description: "Điểm số (0 – 100)",
            },
            major: {
              type: "string",
              enum: ["IT", "Business", "Design", "Marketing"],
              example: "IT",
              description: "Ngành học",
            },
            enrollmentDate: {
              type: "string",
              format: "date-time",
              example: "2024-09-01T00:00:00.000Z",
              description: "Ngày nhập học",
            },
          },
        },

        // ── Full student document (response) ─────────────────
        Student: {
          allOf: [
            { $ref: "#/components/schemas/StudentInput" },
            {
              type: "object",
              properties: {
                _id: {
                  type: "string",
                  example: "664a1b2c3d4e5f6789abcdef",
                },
                isActive: {
                  type: "boolean",
                  example: true,
                  description: "Trạng thái sinh viên (false = đã xóa mềm)",
                },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          ],
        },

        // ── Paginated list ────────────────────────────────────
        PaginatedStudents: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            data: {
              type: "array",
              items: { $ref: "#/components/schemas/Student" },
            },
            pagination: {
              type: "object",
              properties: {
                page: { type: "integer", example: 1 },
                limit: { type: "integer", example: 10 },
                total: { type: "integer", example: 25 },
                totalPages: { type: "integer", example: 3 },
              },
            },
          },
        },

        // ── Error response ────────────────────────────────────
        Error: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Không tìm thấy sinh viên" },
          },
        },
      },
    },
  },
  // Quét JSDoc comments trong routes
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerJsdoc(options);
