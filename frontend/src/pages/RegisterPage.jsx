import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePopup } from '../contexts/PopupContext';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const { register } = useAuth();
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      showPopup({
        title: 'Thành công',
        message: 'Đăng ký tài khoản thành công!Chào mừng bạn đến với FlowBooks.',
        type: 'success',
        onConfirm: () => navigate('/')
      });
    } catch (error) {
      showPopup({
        title: 'Lỗi đăng ký',
        message: error?.response?.data?.message || 'Không thể tạo tài khoản. Vui lòng kiểm tra lại thông tin.',
        type: 'error'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Đăng ký tài khoản</h2>
      <p className="form-subtitle">Tạo tài khoản mới để bắt đầu mua sách trực tuyến.</p>

      <div className="form-group">
        <input
          placeholder="Họ tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>

      <div className="form-group">
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={form.password_confirmation}
          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
        />
      </div>

      <button type="submit">Tạo tài khoản</button>
    </form>
  );
}