import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-badge">✨ Bộ sưu tập sách chọn lọc</div>

        <h2 className="hero-title">
          Không gian mua sách <span>sang trọng</span>, hiện đại và dễ dùng
        </h2>

        <p className="hero-text">
          FlowBooks mang đến trải nghiệm mua sách trực tuyến tinh gọn với giao diện đẹp,
          tìm kiếm nhanh, quản lý giỏ hàng thuận tiện và kết nối hoàn chỉnh giữa
          React Frontend với Laravel REST API bằng Sanctum.
        </p>

        <div className="hero-actions">
          <Link to="/books">
            <button>Khám phá sách</button>
          </Link>
          <Link to="/register">
            <button className="secondary-btn">Tạo tài khoản</button>
          </Link>
        </div>

        <div className="hero-stats">
          <div className="stat-box">
            <h4>1.000+</h4>
            <p>Đầu sách đa dạng</p>
          </div>
          <div className="stat-box">
            <h4>24/7</h4>
            <p>Truy cập mọi lúc</p>
          </div>
          <div className="stat-box">
            <h4>API</h4>
            <p>Kết nối chuẩn RESTful</p>
          </div>
        </div>
      </div>

      <div className="hero-right">
        <div className="feature-card">
          <h3>Tìm kiếm thông minh</h3>
          <p>Tìm sách theo tên, tác giả hoặc ISBN với giao diện gọn gàng, dễ thao tác.</p>
        </div>

        <div className="feature-card">
          <h3>Đặt hàng nhanh chóng</h3>
          <p>Thêm sách vào giỏ hàng, tạo đơn và theo dõi đơn hàng ngay trên cùng một hệ thống.</p>
        </div>

        <div className="feature-card">
          <h3>Thiết kế học thuật nhưng hiện đại</h3>
          <p>Phù hợp để demo môn học, báo cáo tiểu luận và triển khai mở rộng thành web thực tế.</p>
        </div>
      </div>
    </section>
  );
}