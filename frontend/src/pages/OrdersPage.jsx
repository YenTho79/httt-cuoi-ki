import React, { useEffect, useState } from 'react';
import api from '../api/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders').then((res) => setOrders(res.data));
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case 'pending':
        return <span style={{ color: '#f59e0b' }}>Chờ xử lý</span>;
      case 'processing':
        return <span style={{ color: '#3b82f6' }}>Đang xử lý</span>;
      case 'completed':
        return <span style={{ color: '#10b981' }}>Hoàn thành</span>;
      case 'cancelled':
        return <span style={{ color: '#ef4444' }}>Đã hủy</span>;
      default:
        return status;
    }
  };

  const renderPayment = (payment) => {
    return payment === 'paid' ? (
      <span style={{ color: '#10b981' }}>Đã thanh toán</span>
    ) : (
      <span style={{ color: '#ef4444' }}>Chưa thanh toán</span>
    );
  };

  return (
    <section>
      <h2 className="page-title">Lịch sử đơn hàng</h2>

      <div className="orders-wrap">
        {orders.length === 0 ? (
          <p>Chưa có đơn hàng nào.</p>
        ) : (
          orders.map((order) => (
            <article key={order.id} className="order-card">
              <h3>Đơn hàng #{order.id}</h3>

              <p>
                Trạng thái: <strong>{renderStatus(order.status)}</strong>
              </p>

              <p>
                Thanh toán: <strong>{renderPayment(order.payment_status)}</strong>
              </p>

              <p>
                Tổng tiền:{' '}
                <strong>
                  {Number(order.total_amount).toLocaleString('vi-VN')} đ
                </strong>
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}