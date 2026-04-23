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
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    orders: 0,
  });

  const [revenue, setRevenue] = useState([]);

  const fetchStats = async () => {
    const { data } = await api.get('/admin/stats');
    setStats(data);
  };

  const fetchRevenue = async () => {
    const { data } = await api.get('/admin/revenue');
    setRevenue(data);
  };

  useEffect(() => {
    fetchStats();
    fetchRevenue();
  }, []);

  return (
    <section>
      <h2 className="page-title">Admin Dashboard</h2>
      <p className="section-desc">
        Tổng quan hệ thống nhà sách FlowBooks.
      </p>

      {/* STAT BOX */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div className="stat-box">
          <h4>{stats.books}</h4>
          <p>Tổng số sách</p>
        </div>

        <div className="stat-box">
          <h4>{stats.users}</h4>
          <p>Tổng người dùng</p>
        </div>

        <div className="stat-box">
          <h4>{stats.orders}</h4>
          <p>Tổng đơn hàng</p>
        </div>
      </div>

      {/* CHART */}
      <div className="section-card" style={{ marginBottom: 30 }}>
        <h3>Doanh thu theo tháng</h3>

        <Bar
          data={{
            labels: revenue.map((r) => r.month),
            datasets: [
              {
                label: 'Doanh thu',
                data: revenue.map((r) => r.total),
              },
            ],
          }}
        />
      </div>

      {/* QUICK ACTION */}
      <div className="section-card">
        <h3>Chức năng nhanh</h3>
        <p>Truy cập nhanh các chức năng quản lý:</p>

        <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          <Link to="/admin">
            <button>Quản lý sách</button>
          </Link>

          <Link to="/admin/orders">
            <button>Quản lý đơn hàng</button>
          </Link>
        </div>
      </div>
    </section>
  );
}