import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-logo">FB</div>
          <div>
            <h1 className="brand-title">FlowBooks</h1>
            <p className="brand-subtitle">Pink luxury bookstore experience</p>
          </div>
        </div>

        <nav className="nav-links">
          <Link className="nav-pill" to="/">Trang chủ</Link>
          <Link className="nav-pill" to="/books">Sách</Link>
          <Link className="nav-pill" to="/cart">Giỏ hàng</Link>
          <Link className="nav-pill" to="/orders">Đơn hàng</Link>

          {user?.role === 'admin' && (
            <>
              <Link className="nav-pill" to="/admin">Admin</Link>
              <Link className="nav-pill" to="/admin/orders">Quản lý đơn</Link>
              <Link className="nav-pill" to="/admin/inventory">Tồn kho</Link>
            </>
          )}
        </nav>

        <div className="auth-links">
          {user ? (
            <>
              <span className="user-badge">Xin chào, {user.name}</span>
              <button onClick={logout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link className="nav-pill" to="/login">Đăng nhập</Link>
              <Link className="nav-pill" to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </header>

      <Outlet />

      <div className="footer-note">
        © 2026 FlowBooks. Pink luxury bookstore experience.
      </div>
    </div>
  );
}