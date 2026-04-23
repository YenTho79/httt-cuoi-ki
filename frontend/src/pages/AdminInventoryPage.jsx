import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdminInventoryPage() {
  const [stats, setStats] = useState({
    total_books: 0,
    total_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
  });

  const [books, setBooks] = useState([]);

  const fetchInventory = async () => {
    const [statsRes, listRes] = await Promise.all([
      api.get('/admin/inventory/stats'),
      api.get('/admin/inventory/list'),
    ]);

    setStats(statsRes.data);
    setBooks(listRes.data);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const stockColor = (stock) => {
    if (stock === 0) return '#ef4444';
    if (stock <= 5) return '#f59e0b';
    return '#10b981';
  };

  const stockLabel = (stock) => {
    if (stock === 0) return 'Hết hàng';
    if (stock <= 5) return 'Sắp hết';
    return 'Còn hàng';
  };

  return (
    <section>
      <h2 className="page-title">Admin - Thống kê tồn kho</h2>
      <p className="section-desc">
        Theo dõi số lượng sách trong kho, sách sắp hết và sách đã hết hàng.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 20,
          marginBottom: 30,
        }}
      >
        <div className="stat-box">
          <h4>{stats.total_books}</h4>
          <p>Tổng đầu sách</p>
        </div>

        <div className="stat-box">
          <h4>{stats.total_stock}</h4>
          <p>Tổng số lượng tồn</p>
        </div>

        <div className="stat-box">
          <h4>{stats.low_stock}</h4>
          <p>Sách sắp hết</p>
        </div>

        <div className="stat-box">
          <h4>{stats.out_of_stock}</h4>
          <p>Sách hết hàng</p>
        </div>
      </div>

      <div className="section-card" style={{ padding: 20 }}>
        <h3 style={{ marginTop: 0 }}>Danh sách tồn kho</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Tên sách</th>
                <th style={thStyle}>ISBN</th>
                <th style={thStyle}>Giá</th>
                <th style={thStyle}>Tồn kho</th>
                <th style={thStyle}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td style={tdStyle}>{book.id}</td>
                  <td style={tdStyle}>{book.title}</td>
                  <td style={tdStyle}>{book.isbn || 'Chưa có'}</td>
                  <td style={tdStyle}>
                    {Number(book.price).toLocaleString('vi-VN')} đ
                  </td>
                  <td style={tdStyle}>{book.stock_quantity}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        color: stockColor(book.stock_quantity),
                        fontWeight: 700,
                      }}
                    >
                      {stockLabel(book.stock_quantity)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px',
  borderBottom: '1px solid #e5e7eb',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #e5e7eb',
};