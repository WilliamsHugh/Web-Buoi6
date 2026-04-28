/**
 * logger middleware (tùy chọn)
 * Ghi log request method, url, thời gian xử lý
 */
module.exports = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor =
      res.statusCode >= 500
        ? "\x1b[31m" // đỏ
        : res.statusCode >= 400
        ? "\x1b[33m" // vàng
        : "\x1b[32m"; // xanh lá

    console.log(
      `${statusColor}[${new Date().toISOString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)\x1b[0m`
    );
  });

  next();
};
