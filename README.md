# Hệ thống Quản lý Nhà sách trực tuyến

Bộ khung ứng dụng full-stack được xây dựng bám theo tài liệu báo cáo môn học:
- Backend: Laravel 11 + Sanctum + MySQL
- Frontend: React + Vite + Axios + React Router
- Tài liệu: sơ đồ Use Case, Class, Sequence bằng Mermaid

## 1. Cấu trúc thư mục

```text
bookstore_app/
├─ backend/
│  ├─ app/
│  ├─ database/migrations/
│  └─ routes/api.php
├─ frontend/
│  └─ src/
├─ docs/
│  └─ uml.md
└─ README.md
```

## 2. Tính năng đã mô hình hóa

### Khách hàng
- Đăng ký, đăng nhập, đăng xuất
- Xem danh sách sách
- Xem chi tiết sách
- Tìm kiếm và lọc sách
- Thêm vào giỏ hàng
- Tạo đơn hàng
- Xem lịch sử đơn hàng
- Gửi đánh giá sách

### Quản trị viên
- Quản lý sách
- Quản lý danh mục
- Quản lý đơn hàng
- Xem thống kê cơ bản

## 3. Cài đặt backend (Laravel + Sanctum)

### Tạo project Laravel mới
```bash
composer create-project laravel/laravel backend
cd backend
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### Cấu hình `.env`
```env
APP_NAME=BookStore
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bookstore_db
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Chạy backend
```bash
php artisan serve
```

## 4. Cài đặt frontend (React)

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm install axios react-router-dom
npm run dev
```

Tạo file `.env` trong thư mục `frontend`:
```env
VITE_API_URL=http://127.0.0.1:8000/api
```

## 5. Luồng xác thực
- Người dùng đăng ký/đăng nhập tại frontend.
- Frontend gửi request đến API Laravel.
- Backend xác thực thành công và tạo token Sanctum.
- Frontend lưu token vào localStorage.
- Các request cần đăng nhập sẽ gửi `Authorization: Bearer <token>`.

## 6. API chính
- `POST /api/register`
- `POST /api/login`
- `POST /api/logout`
- `GET /api/books`
- `GET /api/books/{id}`
- `GET /api/categories`
- `GET /api/cart`
- `POST /api/cart/items`
- `PATCH /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`
- `POST /api/orders`
- `GET /api/orders`
- `POST /api/books/{book}/reviews`

## 7. Sơ đồ UML
Xem file: `docs/uml.md`

## 8. Gợi ý mở rộng
- Thanh toán giả lập hoặc tích hợp VNPay/MoMo
- Dashboard doanh thu theo ngày/tháng/năm
- Quản lý vận chuyển, sổ quỹ
- Phân quyền chi tiết hơn bằng middleware role

