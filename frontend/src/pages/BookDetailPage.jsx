import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { usePopup } from '../contexts/PopupContext';

export default function BookDetailPage() {
  const { id } = useParams();
  const { showPopup } = usePopup();

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const fetchBook = async () => {
    const res = await api.get(`/books/${id}`);
    setBook(res.data);
  };

  const fetchReviews = async () => {
    const res = await api.get(`/reviews/${id}`);
    setReviews(res.data);
  };

  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id]);

  const submitReview = async () => {
    try {
      await api.post('/reviews', {
        book_id: id,
        rating,
        comment,
      });
      showPopup({
        title: 'Thành công',
        message: 'Cảm ơn bạn đã gửi đánh giá!',
        type: 'success'
      });
      setComment('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      showPopup({
        title: 'Thông báo',
        message: 'Bạn cần đăng nhập để đánh giá sản phẩm',
        type: 'info'
      });
    }
  };

  if (!book) return <p>Đang tải...</p>;

  return (
    <section className="detail-card">
      <div className="detail-grid">
        <img
          className="detail-cover"
          src={book.cover_image || 'https://placehold.co/320x420?text=Book'}
          alt={book.title}
        />

        <div>
          <h2 className="detail-title">{book.title}</h2>
          <p className="detail-meta">Tác giả: {book.author}</p>
          <p className="detail-meta">ISBN: {book.isbn}</p>
          <p className="detail-meta">Tồn kho: {book.stock_quantity}</p>
          <p className="detail-price">{Number(book.price).toLocaleString('vi-VN')} đ</p>
          <p className="detail-desc">{book.description}</p>

          <div style={{ marginTop: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 8, padding: '4px 8px' }}>
              <span style={{ marginRight: 8 }}>Số lượng:</span>
              <input
                type="number"
                min="1"
                defaultValue="1"
                id="qty-input"
                style={{ width: 60, border: 'none', padding: 8, outline: 'none' }}
              />
            </div>
            <button
              onClick={async () => {
                const qty = document.getElementById('qty-input').value;
                try {
                  await api.post('/cart/items', {
                    book_id: book.id,
                    quantity: parseInt(qty),
                  });
                  showPopup({
                    title: 'Thành công',
                    message: `Đã thêm ${qty} cuốn vào giỏ hàng`,
                    type: 'success'
                  });
                } catch (err) {
                  showPopup({
                    title: 'Thông báo',
                    message: 'Bạn cần đăng nhập để thêm vào giỏ hàng',
                    type: 'info'
                  });
                }
              }}
              style={{ padding: '12px 24px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', fontWeight: 'bold' }}
            >
              Thêm vào giỏ hàng
            </button>
          </div>

          <div style={{ marginTop: 30 }}>
            <h3>Đánh giá sản phẩm</h3>

            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              <option value="5">⭐⭐⭐⭐⭐</option>
              <option value="4">⭐⭐⭐⭐</option>
              <option value="3">⭐⭐⭐</option>
              <option value="2">⭐⭐</option>
              <option value="1">⭐</option>
            </select>

            <br /><br />

            <textarea
              placeholder="Nhận xét..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                minHeight: 100,
                padding: 12,
                borderRadius: 12,
                border: '1px solid #ddd',
              }}
            />

            <br /><br />

            <button onClick={submitReview}>Gửi đánh giá</button>
          </div>

          <div style={{ marginTop: 30 }}>
            <h3>Đánh giá từ người dùng</h3>

            {reviews.length === 0 ? (
              <p>Chưa có đánh giá nào.</p>
            ) : (
              reviews.map((r) => (
                <div
                  key={r.id}
                  style={{
                    marginBottom: 12,
                    padding: 12,
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    background: '#fff',
                  }}
                >
                  <strong>{r.user_name}</strong> - {'⭐'.repeat(r.rating)}
                  <p style={{ marginTop: 8 }}>{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}