const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");

const studentRoutes = require("./routes/student.routes");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const swaggerSpec = require("./config/swagger");

const app = express();

// ── Security & Parsing middlewares ──────────────────────────
// Tắt contentSecurityPolicy để Swagger UI load được CSS/JS
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// ── Logger middlewares ───────────────────────────────────────
app.use(morgan("dev"));   // morgan logger (built-in)
app.use(logger);          // custom logger middleware (tùy chọn)

// ── Swagger UI ───────────────────────────────────────────────
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "🎓 Student API Docs",
    customCss: `
      .topbar { background-color: #1a1a2e !important; }
      .topbar-wrapper img { display: none; }
      .topbar-wrapper::after {
        content: "🎓 Student API";
        color: white;
        font-size: 1.4rem;
        font-weight: bold;
        padding-left: 16px;
      }
      .swagger-ui .info .title { color: #1a1a2e; }
    `,
    swaggerOptions: {
      docExpansion: "list",
      defaultModelsExpandDepth: 1,
      filter: true,
      tryItOutEnabled: true,
    },
  })
);

// ── Swagger JSON (dùng để import vào Postman) ────────────────
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(swaggerSpec);
});

// ── Student Routes ───────────────────────────────────────────
app.use("/api/students", studentRoutes);

// ── Health check ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    message: "🎓 Student API is running",
    version: "1.0.0",
    endpoints: {
      students: "/api/students",
      swagger: "/api-docs",
      swaggerJson: "/api-docs.json",
    },
  });
});

// ── Global error handler (phải đặt cuối cùng) ───────────────
app.use(errorHandler);

module.exports = app;
