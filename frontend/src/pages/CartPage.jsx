import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { usePopup } from '../contexts/PopupContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const [cart, setCart] = useState(null);
  const [shippingAddress, setShippingAddress] = useState('TP.HCM');

  const fetchCart = async () => {
    const { data } = await api.get('/cart');
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total =
    cart?.items?.reduce((sum, item) => sum + item.quantity * Number(item.unit_price), 0) || 0;

  const handleCheckout = () => {
    if (!cart?.items?.length) return;

    showPopup({
      title: 'Xác nhận đơn hàng',
      message: `Bạn xác nhận thanh toán ${total.toLocaleString('vi-VN')} đ?`,
      type: 'confirm',
      onConfirm: async () => {
        try {
          await api.post('/orders', {
            shipping_address: shippingAddress,
          });

          // Show success popup before navigating
          showPopup({
            title: 'Thanh toán thành công',
            message: 'Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.',
            type: 'success',
            onConfirm: () => navigate('/orders')
          });
        } catch (error) {
          console.error(error);
          showPopup({
            title: 'Lỗi',
            message: error?.response?.data?.message || 'Không thể xử lý đơn hàng lúc này.',
            type: 'error'
          });
        }
      },
    });
  };

  return (
    <section>
      <h2 className="page-title">Giỏ hàng</h2>

      {!cart?.items?.length ? (
        <div className="empty-box">Chưa có sản phẩm nào trong giỏ hàng.</div>
      ) : (
        <div className="cart-wrap">
          {cart.items.map((item) => (
            <div key={item.id} className="cart-item">
              <strong>{item.book?.title}</strong>
              <p>Số lượng: {item.quantity}</p>
              <p>Đơn giá: {Number(item.unit_price).toLocaleString('vi-VN')} đ</p>
            </div>
          ))}

          <div className="total-box">
            <h3>Tổng tiền: {total.toLocaleString('vi-VN')} đ</h3>

            <input
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Địa chỉ giao hàng"
            />

            <br /><br />

            <button onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </div>
      )}
    </section>
  );
}