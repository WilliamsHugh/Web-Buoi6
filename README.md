# 📚 Book API - Bài Tập Web Buổi 6

REST API quản lý sách xây dựng bằng **Node.js + Express + MongoDB (Mongoose)**.

## 🏗️ Kiến trúc project

```
Web-Buoi6/
├── server.js                   # Entry point
├── .env                        # Biến môi trường
├── package.json
└── src/
    ├── app.js                  # Cấu hình Express app + middlewares
    ├── config/
    │   └── db.js               # Kết nối MongoDB
    ├── models/
    │   └── Book.js             # Mongoose schema & model
    ├── services/
    │   └── book.service.js     # Business logic (DI)
    ├── controllers/
    │   └── book.controller.js  # Xử lý HTTP request/response (DI)
    ├── routes/
    │   └── book.routes.js      # Định nghĩa routes
    ├── middlewares/
    │   ├── validateObjectId.js # Kiểm tra MongoDB ObjectId hợp lệ
    │   ├── errorHandler.js     # Global error handler
    │   └── logger.js           # Custom logger (tùy chọn)
    └── container/
        └── index.js            # Dependency Injection container
```

## 📦 Cài đặt

```bash
npm install
```

Tạo file `.env`:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/book-api
```

Chạy development:
```bash
npm run dev
```

---

## 📋 Model Book

| Trường        | Kiểu     | Mô tả                                                     |
|---------------|----------|-----------------------------------------------------------|
| `bookId`      | String   | Mã sách (unique, required, uppercase)                     |
| `title`       | String   | Tiêu đề sách (required, 2-200 ký tự)                      |
| `author`      | String   | Tên tác giả (required, 2-100 ký tự)                       |
| `price`       | Number   | Giá sách (min: 0, max: 9999999, default: 0)               |
| `genre`       | String   | Thể loại (Fiction/NonFiction/Science/History/Technology)  |
| `publishedAt` | Date     | Ngày xuất bản (default: Date.now)                         |
| `isAvailable` | Boolean  | Trạng thái còn hàng (default: true)                       |

---

## 🚀 API Endpoints

### 1. CRUD Cơ Bản

#### Tạo sách
```http
POST /api/books
Content-Type: application/json

{
  "bookId": "BOOK001",
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 350000,
  "genre": "Technology"
}
```

#### Lấy danh sách sách (có pagination + filter)
```http
GET /api/books?page=1&limit=10&genre=Technology
```

Response:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### Lấy chi tiết sách
```http
GET /api/books/:id
```

#### Cập nhật sách
```http
PUT /api/books/:id
Content-Type: application/json

{
  "title": "Clean Code (Updated)",
  "price": 380000
}
```

#### Xóa mềm (soft delete)
```http
DELETE /api/books/:id
```
> Đặt `isAvailable = false`, không xóa thật khỏi database

---

### 2. API Cập Nhật Giá

```http
PATCH /api/books/:id/price
Content-Type: application/json

{ "price": 250000 }
```

| Trường hợp         | HTTP Status |
|--------------------|-------------|
| Thành công         | 200         |
| price không hợp lệ | 400         |
| Không tìm thấy     | 404         |
| ID không hợp lệ    | 400         |

---

### 3. API Nâng Cao

#### Top sách theo giá cao nhất
```http
GET /api/books/top?limit=5
```

#### Thống kê giá trung bình
```http
GET /api/books/stats/avg
```

Response:
```json
{
  "success": true,
  "data": {
    "avgPrice": 275000,
    "totalBooks": 20
  }
}
```

#### Tìm kiếm theo tiêu đề hoặc tác giả
```http
GET /api/books/search?q=clean
```

---

## 🛡️ Middlewares

| Middleware           | Mô tả                                              |
|---------------------|----------------------------------------------------|
| `validateObjectId`  | Kiểm tra id có phải MongoDB ObjectId hợp lệ       |
| `errorHandler`      | Xử lý lỗi tập trung: duplicate key, validation... |
| `logger`            | Ghi log method, url, status, thời gian xử lý      |
| `morgan`            | HTTP request logger (built-in)                    |
| `helmet`            | Bảo mật HTTP headers                              |
| `cors`              | Cross-Origin Resource Sharing                     |

---

## 💡 So sánh với bài tập Student API

| Tiêu chí          | Student API          | Book API (Bài tập này) |
|-------------------|----------------------|------------------------|
| Model             | Student              | Book                   |
| ID field          | studentId            | bookId                 |
| Numeric field     | score (0-100)        | price (0-9999999)      |
| Enum filter       | major                | genre                  |
| PATCH endpoint    | /score               | /price                 |
| Top API           | Top theo điểm        | Top theo giá           |
| Search            | Theo tên             | Theo tiêu đề / tác giả |
| Stats             | Điểm trung bình      | Giá trung bình + total |
