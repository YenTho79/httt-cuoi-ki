# 📚 FlowBooks - Hệ Thống Quản Lý Nhà Sách Trực Tuyến

FlowBooks là một ứng dụng quản lý nhà sách hiện đại, được xây dựng với kiến trúc hướng dịch vụ, giao diện sang trọng (Pink Luxury) và đầy đủ các tính năng thương mại điện tử cơ bản.

---

## 🚀 Tính Năng Chính
- **Tìm kiếm & Lọc sách:** Tìm kiếm thông minh theo tên, tác giả, ISBN và lọc theo giá.
- **Giỏ hàng & Thanh toán:** Quy trình thanh toán hiện đại với các bước xác nhận bằng Popup Modal.
- **Quản lý đơn hàng:** Khách hàng theo dõi trạng thái đơn; Admin duyệt và cập nhật đơn hàng.
- **Đánh giá sản phẩm:** Hệ thống chấm điểm sao và bình luận chi tiết.
- **Admin Dashboard:** Báo cáo doanh thu bằng biểu đồ và thống kê tồn kho thông minh.

---

## 🛠 Công Nghệ Sử Dụng
- **Backend:** Laravel 11 (PHP 8.2+)
- **Frontend:** React JS + Vite (Vanilla CSS)
- **Database:** MySQL / MariaDB

---

## ⚙️ Cài đặt và Thiết lập

### 1. Cấu hình Cơ sở dữ liệu
1. Mở XAMPP hoặc Laragon và khởi động **MySQL**.
2. Tạo một database mới tên là `bookstore_db`.
3. Import file dữ liệu mẫu:
   - Sử dụng công cụ (như phpMyAdmin) để import file `bookstore_db.sql` nằm ở thư mục gốc của dự án.
   - Hoặc dùng lệnh: `mysql -u root bookstore_db < bookstore_db.sql`

### 2. Thiết lập Backend (Laravel)
Di chuyển vào thư mục backend:
```bash
cd backend
```
1. Cài đặt các thư viện PHP:
   ```bash
   composer install
   ```
2. Cấu hình môi trường:
   - Sao chép file `.env.example` thành `.env`.
   - Kiểm tra các thông số Database trong file `.env`:
     ```env
     DB_CONNECTION=mysql
     DB_HOST=127.0.0.1
     DB_PORT=3306
     DB_DATABASE=bookstore_db
     DB_USERNAME=root
     DB_PASSWORD=
     ```
3. Tạo key ứng dụng:
   ```bash
   php artisan key:generate
   ```

### 3. Thiết lập Frontend (React)
Di chuyển vào thư mục frontend:
```bash
cd frontend
```
1. Cài đặt các thư viện Node:
   ```bash
   npm install
   ```

---

## 🏃‍♂️ Khởi chạy ứng dụng

Để ứng dụng hoạt động, bạn cần khởi chạy đồng thời cả Backend và Frontend:

### Bước 1: Chạy Backend
Mở một terminal tại thư mục `backend` và chạy:
```bash
php artisan serve
```
*Server sẽ chạy tại: `http://127.0.0.1:8000`*

### Bước 2: Chạy Frontend
Mở một terminal khác tại thư mục `frontend` và chạy:
```bash
npm run dev
```
*Giao diện sẽ chạy tại: `http://localhost:5173`*

---

## 🔐 Tài khoản thử nghiệm (Demo)
- **Admin:**
  - Email: `admin@bookstore.com`
  - Mật khẩu: `password`
- **Khách hàng:**
  - Email: `customer1@bookstore.com`
  - Mật khẩu: `password`

---

## 📁 Cấu trúc thư mục
- `/backend`: Mã nguồn Laravel API.
- `/frontend`: Mã nguồn React JS (Vite).
- `bookstore_db.sql`: File cơ sở dữ liệu mẫu.
- `.gitignore`: Cấu hình loại bỏ tệp tin rác cho Git.

---
© 2026 FlowBooks Project.
