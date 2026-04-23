import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { usePopup } from '../contexts/PopupContext';

export default function AdminInventoryPage() {
  const { showPopup } = usePopup();
  const [stats, setStats] = useState({
    total_books: 0,
    total_stock: 0,
    low_stock: 0,
    out_of_stock: 0,
  });

  const [books, setBooks] = useState([]);
  const [filter, setFilter] = useState('all'); // all, low, out

  const fetchInventory = async () => {
    try {
      const [statsRes, listRes] = await Promise.all([
        api.get('/admin/inventory/stats'),
        api.get('/admin/inventory/list'),
      ]);
      setStats(statsRes.data);
      setBooks(listRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id, newStock) => {
    try {
      await api.put(`/admin/inventory/${id}`, { stock_quantity: newStock });
      showPopup({ title: 'Thành công', message: 'Cập nhật tồn kho thành công', type: 'success' });
      fetchInventory();
    } catch (err) {
      showPopup({ title: 'Lỗi', message: 'Không thể cập nhật số lượng', type: 'error' });
    }
  };

  const filteredBooks = books.filter(b => {
    if (filter === 'low') return b.stock_quantity > 0 && b.stock_quantity <= 5;
    if (filter === 'out') return b.stock_quantity === 0;
    return true;
  });

  return (
    <section>
      <h2 className="page-title">Quản lý tồn kho</h2>
      
      <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
        <div className="stat-box" onClick={() => setFilter('all')} style={{ cursor: 'pointer', border: filter === 'all' ? '2px solid var(--primary)' : '1px solid #e5e7eb' }}>
          <h4>{stats.total_books}</h4>
          <p>Tổng đầu sách</p>
        </div>
        <div className="stat-box">
          <h4>{stats.total_stock}</h4>
          <p>Tổng số bản</p>
        </div>
        <div className="stat-box" onClick={() => setFilter('low')} style={{ cursor: 'pointer', border: filter === 'low' ? '2px solid #f59e0b' : '1px solid #e5e7eb' }}>
          <h4 style={{ color: '#f59e0b' }}>{stats.low_stock}</h4>
          <p>Sắp hết hàng</p>
        </div>
        <div className="stat-box" onClick={() => setFilter('out')} style={{ cursor: 'pointer', border: filter === 'out' ? '2px solid #ef4444' : '1px solid #e5e7eb' }}>
          <h4 style={{ color: '#ef4444' }}>{stats.out_of_stock}</h4>
          <p>Hết hàng</p>
        </div>
      </div>

      <div className="section-card" style={{ padding: 24 }}>
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Danh sách kho hàng ({filter === 'low' ? 'Sắp hết' : filter === 'out' ? 'Hết hàng' : 'Tất cả'})</h3>
          <button className="secondary-btn" onClick={() => setFilter('all')}>Hiện tất cả</button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên sách / ISBN</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>
                  <strong>{book.title}</strong>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{book.isbn || 'Chưa có ISBN'}</div>
                </td>
                <td>{Number(book.price).toLocaleString('vi-VN')} đ</td>
                <td>
                  <input 
                    type="number" 
                    defaultValue={book.stock_quantity}
                    className="stock-input"
                    onBlur={(e) => {
                      const val = parseInt(e.target.value);
                      if (val !== book.stock_quantity) handleUpdateStock(book.id, val);
                    }}
                  />
                </td>
                <td>
                   <span className={`status-badge ${book.stock_quantity === 0 ? 'status-pending' : book.stock_quantity <= 5 ? 'status-processing' : 'status-completed'}`}>
                     {book.stock_quantity === 0 ? 'Hết hàng' : book.stock_quantity <= 5 ? 'Chỉ còn ' + book.stock_quantity : 'Sẵn sàng'}
                   </span>
                </td>
                <td>
                  <button 
                    className="secondary-btn"
                    onClick={() => handleUpdateStock(book.id, book.stock_quantity + 10)}
                    style={{ padding: '4px 8px', fontSize: 12 }}
                  >
                    +10 cuốn
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}