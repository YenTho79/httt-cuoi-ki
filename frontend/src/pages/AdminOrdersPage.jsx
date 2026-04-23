import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { usePopup } from '../contexts/PopupContext';

export default function AdminOrdersPage() {
  const { showPopup } = usePopup();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/admin/orders');
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (id, status, paymentStatus) => {
    try {
      await api.put(`/admin/orders/${id}`, {
        status,
        payment_status: paymentStatus,
      });
      showPopup({ title: 'Thành công', message: 'Cập nhật trạng thái đơn hàng thành công', type: 'success' });
      fetchOrders();
      if (selectedOrder?.order?.id === id) {
        viewDetail(id);
      }
    } catch (err) {
      showPopup({ title: 'Lỗi', message: 'Không thể cập nhật đơn hàng', type: 'error' });
    }
  };

  const viewDetail = async (id) => {
    try {
      const { data } = await api.get(`/admin/orders/${id}`);
      setSelectedOrder(data);
    } catch (err) {
      showPopup({ title: 'Lỗi', message: 'Không thể tải chi tiết đơn hàng', type: 'error' });
    }
  };

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  return (
    <section>
      <div className="flex-between">
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Quản lý đơn hàng</h2>
          <p className="section-desc">Theo dõi và cập nhật trạng thái đơn hàng của khách hàng.</p>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'processing', 'completed', 'cancelled'].map(f => (
          <button 
            key={f} 
            className={`filter-tab ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ xử lý' : f === 'processing' ? 'Đang xử lý' : f === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
          </button>
        ))}
      </div>

      <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 20 }}>
        {filteredOrders.map((order) => (
          <article key={order.id} className="section-card" style={{ padding: 20 }}>
            <div className="flex-between" style={{ marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Đơn hàng #{order.id}</h3>
              <span className={`status-badge status-${order.status}`}>
                {order.status}
              </span>
            </div>
            
            <div style={{ marginBottom: 15, fontSize: 14 }}>
              <p style={{ margin: '4px 0' }}><strong>Khách hàng:</strong> {order.user_name}</p>
              <p style={{ margin: '4px 0' }}><strong>Tổng tiền:</strong> <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{Number(order.total_amount).toLocaleString('vi-VN')} đ</span></p>
              <p style={{ margin: '4px 0' }}><strong>Thanh toán:</strong> {order.payment_status}</p>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button 
                className="secondary-btn" 
                style={{ padding: '8px 12px', fontSize: 13 }}
                onClick={() => viewDetail(order.id)}
              >
                Chi tiết
              </button>
              
              {order.status === 'pending' && (
                <button 
                  style={{ padding: '8px 12px', fontSize: 13 }}
                  onClick={() => updateOrder(order.id, 'processing', order.payment_status)}
                >
                  Xử lý ngay
                </button>
              )}
              
              {order.status === 'processing' && (
                <button 
                  style={{ padding: '8px 12px', fontSize: 13, background: '#10b981' }}
                  onClick={() => updateOrder(order.id, 'completed', 'paid')}
                >
                  Hoàn thành
                </button>
              )}

              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <button 
                  className="secondary-btn"
                  style={{ padding: '8px 12px', fontSize: 13, color: '#ef4444' }}
                  onClick={() => updateOrder(order.id, 'cancelled', 'unpaid')}
                >
                  Hủy đơn
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" style={{ maxWidth: 600, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Chi tiết đơn hàng #{selectedOrder.order.id}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <p><strong>Khách hàng:</strong> {selectedOrder.order.user_name}</p>
                <p><strong>Email:</strong> {selectedOrder.order.user_email}</p>
              </div>
              <div>
                <p><strong>Trạng thái:</strong> {selectedOrder.order.status}</p>
                <p><strong>Thanh toán:</strong> {selectedOrder.order.payment_status}</p>
              </div>
            </div>

            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>SL</th>
                    <th>Đơn giá</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.title}</td>
                      <td>{item.quantity}</td>
                      <td>{Number(item.unit_price).toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex-between" style={{ marginTop: 20 }}>
              <h4>Tổng cộng: {Number(selectedOrder.order.total_amount).toLocaleString('vi-VN')} đ</h4>
              <button className="secondary-btn" onClick={() => setSelectedOrder(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}