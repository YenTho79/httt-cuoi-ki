import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { usePopup } from '../contexts/PopupContext';

export default function BooksPage() {
  const { showPopup } = usePopup();
  const [books, setBooks] = useState([]);
  const [q, setQ] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchBooks = async (search = q, min = minPrice, max = maxPrice) => {
    try {
      const params = {};

      if (search.trim() !== '') {
        params.q = search.trim();
      }

      if (min !== '' && !isNaN(Number(min))) {
        params.min_price = Number(min);
      }

      if (max !== '' && !isNaN(Number(max))) {
        params.max_price = Number(max);
      }

      const { data } = await api.get('/books', { params });
      setBooks(data.data || []);
    } catch (error) {
      console.error(error);
      alert('Không tải được danh sách sách');
    }
  };

  useEffect(() => {
    fetchBooks('', '', '');
  }, []);

  const handleReset = () => {
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    fetchBooks('', '', '');
  };

  return (
    <section>
      <h2 className="page-title">Danh sách sách nổi bật</h2>
      <p className="section-desc">
        Khám phá các đầu sách theo phong cách cửa hàng trực tuyến hiện đại, mềm mại và sang trọng.
      </p>

      <div className="toolbar">
        <div className="search-box">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên sách, tác giả hoặc ISBN"
          />
          <button onClick={() => fetchBooks(q, minPrice, maxPrice)}>Tìm kiếm</button>
        </div>

        <div className="filter-box">
          <input
            type="number"
            placeholder="Giá từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <button onClick={() => fetchBooks(q, minPrice, maxPrice)}>Lọc giá</button>
          <button className="secondary-btn" onClick={handleReset}>Reset</button>
        </div>
      </div>

      <div className="books-grid">
        {books.length === 0 ? (
          <div className="empty-box">Không tìm thấy sách phù hợp.</div>
        ) : (
          books.map((book) => (
            <article key={book.id} className="book-card">
              <div className="book-cover-wrap">
                <span className="book-badge">Hot</span>
                <img
                  className="book-cover"
                  src={book.cover_image || 'https://placehold.co/240x320?text=Book'}
                  alt={book.title}
                />
              </div>

              <h3 className="book-title">{book.title}</h3>
              <p className="book-meta">Tác giả: {book.author}</p>

              <div className="book-price-row">
                <span className="book-price">
                  {Number(book.price).toLocaleString('vi-VN')} đ
                </span>
                <Link className="inline-link" to={`/books/${book.id}`}>
                  Xem chi tiết
                </Link>
              </div>

              <button
                className="add-to-cart-btn"
                onClick={async () => {
                  try {
                    await api.post('/cart/items', {
                      book_id: book.id,
                      quantity: 1,
                    });
                    showPopup({
                      title: 'Thành công',
                      message: `Đã thêm "${book.title}" vào giỏ hàng`,
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
              >
                Thêm vào giỏ
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}