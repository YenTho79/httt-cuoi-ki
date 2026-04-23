import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    const { data } = await api.get('/admin/orders');
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateOrder = async (id, status, paymentStatus) => {
    await api.put(`/admin/orders/${id}`, {
      status,
      payment_status: paymentStatus,
    });
    alert('Cập nhật đơn hàng thành công');
    fetchOrders();

    if (selectedOrder?.order?.id === id) {
      viewDetail(id);
    }
  };

  const viewDetail = async (id) => {
    const { data } = await api.get(`/admin/orders/${id}`);
    setSelectedOrder(data);
  };

  return (
    <section>
      <h2 className="page-title">Admin - Quản lý đơn hàng</h2>
      <p className="section-desc">
        Theo dõi đơn hàng, trạng thái xử lý và trạng thái thanh toán của khách hàng.
      </p>

      <div className="orders-wrap">
        {orders.map((order) => (
          <article key={order.id} className="order-card">
            <h3>Đơn hàng #{order.id}</h3>
            <p>Khách hàng: {order.user_name || 'Không rõ'}</p>
            <p>Email: {order.user_email || 'Không rõ'}</p>
            <p>Địa chỉ giao hàng: {order.shipping_address || 'Chưa có'}</p>
            <p>Tổng tiền: {Number(order.total_amount).toLocaleString('vi-VN')} đ</p>
            <p>Trạng thái hiện tại: {order.status}</p>
            <p>Thanh toán hiện tại: {order.payment_status}</p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
              <button onClick={() => viewDetail(order.id)}>
                Xem chi tiết
              </button>
              <button onClick={() => updateOrder(order.id, 'pending', order.payment_status)}>
                Chờ xử lý
              </button>
              <button onClick={() => updateOrder(order.id, 'processing', order.payment_status)}>
                Đang xử lý
              </button>
              <button onClick={() => updateOrder(order.id, 'completed', 'paid')}>
                Hoàn thành
              </button>
              <button onClick={() => updateOrder(order.id, 'cancelled', 'unpaid')}>
                Hủy đơn
              </button>
            </div>
          </article>
        ))}
      </div>

      {selectedOrder && (
        <div className="section-card" style={{ marginTop: 30, padding: 24 }}>
          <h3>Chi tiết đơn #{selectedOrder.order.id}</h3>
          <p>Khách hàng: {selectedOrder.order.user_name || 'Không rõ'}</p>
          <p>Email: {selectedOrder.order.user_email || 'Không rõ'}</p>
          <p>Địa chỉ giao hàng: {selectedOrder.order.shipping_address || 'Chưa có'}</p>
          <p>Trạng thái: {selectedOrder.order.status}</p>
          <p>Thanh toán: {selectedOrder.order.payment_status}</p>
          <p>
            Tổng tiền: {Number(selectedOrder.order.total_amount).toLocaleString('vi-VN')} đ
          </p>

          <h4 style={{ marginTop: 20 }}>Sản phẩm trong đơn</h4>

          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            {selectedOrder.items?.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: 12,
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  background: '#fff',
                }}
              >
                <strong>{item.title}</strong>
                <p style={{ margin: '6px 0 0' }}>
                  Số lượng: {item.quantity}
                </p>
                <p style={{ margin: '6px 0 0' }}>
                  Đơn giá: {Number(item.unit_price).toLocaleString('vi-VN')} đ
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}