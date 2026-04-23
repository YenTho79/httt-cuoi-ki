# Sơ đồ Use Case, Lớp, Tuần tự

## 1. Use Case tổng quát

```mermaid
flowchart LR
    KH[Khách hàng]
    AD[Quản trị viên]

    UC1((Đăng ký))
    UC2((Đăng nhập))
    UC3((Xem danh sách sách))
    UC4((Tìm kiếm / Lọc sách))
    UC5((Xem chi tiết sách))
    UC6((Thêm vào giỏ hàng))
    UC7((Tạo đơn hàng))
    UC8((Xem lịch sử đơn hàng))
    UC9((Đánh giá sách))

    UC10((Quản lý sách))
    UC11((Quản lý danh mục))
    UC12((Quản lý đơn hàng))
    UC13((Xem thống kê))

    KH --> UC1
    KH --> UC2
    KH --> UC3
    KH --> UC4
    KH --> UC5
    KH --> UC6
    KH --> UC7
    KH --> UC8
    KH --> UC9

    AD --> UC2
    AD --> UC10
    AD --> UC11
    AD --> UC12
    AD --> UC13
```

## 2. Sơ đồ lớp

```mermaid
classDiagram
    class User {
      +id: bigint
      +name: string
      +email: string
      +password: string
      +role: string
    }

    class Category {
      +id: bigint
      +name: string
      +slug: string
      +description: text
    }

    class Book {
      +id: bigint
      +title: string
      +isbn: string
      +author: string
      +price: decimal
      +stock_quantity: int
      +description: text
      +cover_image: string
      +category_id: bigint
    }

    class Cart {
      +id: bigint
      +user_id: bigint
    }

    class CartItem {
      +id: bigint
      +cart_id: bigint
      +book_id: bigint
      +quantity: int
      +unit_price: decimal
    }

    class Order {
      +id: bigint
      +user_id: bigint
      +total_amount: decimal
      +status: string
      +payment_status: string
      +shipping_address: string
    }

    class OrderItem {
      +id: bigint
      +order_id: bigint
      +book_id: bigint
      +quantity: int
      +unit_price: decimal
      +subtotal: decimal
    }

    class Review {
      +id: bigint
      +user_id: bigint
      +book_id: bigint
      +rating: int
      +comment: text
    }

    User "1" --> "1" Cart
    User "1" --> "many" Order
    User "1" --> "many" Review
    Category "1" --> "many" Book
    Cart "1" --> "many" CartItem
    Book "1" --> "many" CartItem
    Order "1" --> "many" OrderItem
    Book "1" --> "many" OrderItem
    Book "1" --> "many" Review
```

## 3. Sơ đồ tuần tự: Đăng nhập

```mermaid
sequenceDiagram
    actor User as Người dùng
    participant FE as React Frontend
    participant API as Laravel API
    participant DB as MySQL

    User->>FE: Nhập email + mật khẩu
    FE->>API: POST /api/login
    API->>DB: Kiểm tra user theo email
    DB-->>API: Trả dữ liệu user
    API->>API: Xác thực mật khẩu
    API-->>FE: Token Sanctum + thông tin user
    FE-->>User: Hiển thị đăng nhập thành công
```

## 4. Sơ đồ tuần tự: Đặt hàng

```mermaid
sequenceDiagram
    actor KH as Khách hàng
    participant FE as React Frontend
    participant API as Laravel API
    participant DB as MySQL

    KH->>FE: Chọn sách và xác nhận đặt hàng
    FE->>API: POST /api/orders
    API->>DB: Đọc giỏ hàng + kiểm tra tồn kho
    DB-->>API: Dữ liệu giỏ hàng hợp lệ
    API->>DB: Tạo orders + order_items
    API->>DB: Trừ tồn kho sách
    API->>DB: Xóa cart_items
    API-->>FE: Đơn hàng thành công
    FE-->>KH: Hiển thị mã đơn và trạng thái
```

## 5. Thiết lập môi trường đề xuất

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8
- Laragon hoặc XAMPP
- VS Code
- Postman

## 6. Kiến trúc triển khai

```mermaid
flowchart TD
    U[Người dùng] --> FE[React Frontend]
    FE --> API[Laravel REST API]
    API --> DB[(MySQL)]
    API --> SANCTUM[Sanctum Token]
```

