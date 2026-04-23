import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePopup } from '../contexts/PopupContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showPopup } = usePopup();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      navigate('/');
    } catch (error) {
      showPopup({
        title: 'Đăng nhập thất bại',
        message: error?.response?.data?.message || 'Email hoặc mật khẩu không chính xác.',
        type: 'error'
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <h2 className="form-title">Đăng nhập</h2>
      <p className="form-subtitle">Truy cập tài khoản để quản lý giỏ hàng và đơn hàng của bạn.</p>

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

      <button type="submit">Đăng nhập</button>
    </form>
  );
}