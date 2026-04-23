import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { Link } from 'react-router-dom';

// chart
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, PointElement, LineElement, Filler);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    orders: 0,
    total_revenue: 0
  });

  const [revenue, setRevenue] = useState([]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRevenue = async () => {
    try {
      const { data } = await api.get('/admin/revenue');
      setRevenue(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRevenue();
  }, []);

  const chartData = {
    labels: revenue.map((r) => `Tháng ${r.month}`),
    datasets: [
      {
        label: 'Doanh thu (VNĐ)',
        data: revenue.map((r) => r.total),
        backgroundColor: 'rgba(255, 114, 159, 0.6)',
        borderColor: 'rgba(255, 114, 159, 1)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(255, 114, 159, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#2b1722',
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 14 },
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Doanh thu: ${Number(context.raw).toLocaleString('vi-VN')} đ`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f3f4f6' },
        ticks: {
          callback: (value) => value.toLocaleString('vi-VN') + ' đ'
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <section>
      <div className="flex-between">
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Tổng quan hệ thống</h2>
          <p className="section-desc">Chào mừng quay lại, Admin. Đây là tình hình kinh doanh của FlowBooks.</p>
        </div>
      </div>

      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
        <div className="stat-box">
          <div style={{ fontSize: 32, marginBottom: 10 }}>📚</div>
          <h4>{stats.books}</h4>
          <p>Đầu sách</p>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: 32, marginBottom: 10 }}>👤</div>
          <h4>{stats.users}</h4>
          <p>Người dùng</p>
        </div>
        <div className="stat-box">
          <div style={{ fontSize: 32, marginBottom: 10 }}>🛒</div>
          <h4>{stats.orders}</h4>
          <p>Đơn hàng</p>
        </div>
        <div className="stat-box" style={{ background: 'var(--primary)', color: '#fff' }}>
          <div style={{ fontSize: 32, marginBottom: 10, color: '#fff' }}>💰</div>
          <h4 style={{ color: '#fff' }}>{Number(stats.total_revenue || 0).toLocaleString('vi-VN')}</h4>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Tổng doanh thu (đ)</p>
        </div>
      </div>

      <div className="section-card" style={{ padding: 24, marginBottom: 30 }}>
        <h3 style={{ margin: '0 0 24px' }}>Biểu đồ doanh thu</h3>
        <div style={{ height: 350 }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      <div className="grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 30 }}>
        <div className="section-card" style={{ padding: 24 }}>
          <h3 style={{ margin: '0 0 16px' }}>Thao tác nhanh</h3>
          <div style={{ display: 'grid', gap: 12 }}>
             <Link to="/admin/books" className="nav-item" style={{ padding: 12, background: '#f9fafb', borderRadius: 12, textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>📦</span> Quản lý kho sách
             </Link>
             <Link to="/admin/orders" className="nav-item" style={{ padding: 12, background: '#f9fafb', borderRadius: 12, textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>📜</span> Duyệt đơn hàng
             </Link>
             <Link to="/admin/inventory" className="nav-item" style={{ padding: 12, background: '#f9fafb', borderRadius: 12, textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span>⚠️</span> Kiểm tra tồn kho
             </Link>
          </div>
        </div>

        <div className="section-card" style={{ padding: 24, display: 'grid', placeItems: 'center', textAlign: 'center', background: 'var(--accent-soft)' }}>
           <div>
              <h3>Phát triển thương hiệu</h3>
              <p>Khuyến mãi đặc biệt dành cho độc giả trung thành sẽ giúp tăng 20% doanh thu tháng tới.</p>
              <button style={{ marginTop: 16 }}>Tạo chiến dịch ngay</button>
           </div>
        </div>
      </div>
    </section>
  );
}