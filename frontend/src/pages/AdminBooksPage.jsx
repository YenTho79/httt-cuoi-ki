import React, { useEffect, useState } from 'react';
import api from '../api/client';
import { usePopup } from '../contexts/PopupContext';

export default function AdminBooksPage() {
  const { showPopup } = usePopup();
  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({
    title: '',
    author: '',
    isbn: '',
    price: '',
    stock_quantity: '',
    category_id: '1',
    description: '',
    image_url: 'https://via.placeholder.com/150'
  });

  const fetchBooks = async () => {
    try {
      const { data } = await api.get('/admin/books');
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenAdd = () => {
    setEditingBook(null);
    setForm({
      title: '',
      author: '',
      isbn: '',
      price: '',
      stock_quantity: '',
      category_id: '1',
      description: '',
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (book) => {
    setEditingBook(book);
    setForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      price: book.price,
      stock_quantity: book.stock_quantity,
      category_id: book.category_id,
      description: book.description,
      image_url: book.image_url
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await api.put(`/admin/books/${editingBook.id}`, form);
        showPopup({ title: 'Thành công', message: 'Cập nhật sách thành công', type: 'success' });
      } else {
        await api.post('/admin/books', form);
        showPopup({ title: 'Thành công', message: 'Thêm sách mới thành công', type: 'success' });
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      showPopup({ title: 'Lỗi', message: 'Có lỗi xảy ra khi lưu thông tin', type: 'error' });
    }
  };

  const handleDelete = (id) => {
    showPopup({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa cuốn sách này không?',
      type: 'confirm',
      onConfirm: async () => {
        try {
          await api.delete(`/admin/books/${id}`);
          showPopup({ title: 'Đã xóa', message: 'Đã xóa sách khỏi hệ thống', type: 'success' });
          fetchBooks();
        } catch (err) {
          showPopup({ title: 'Lỗi', message: 'Không thể xóa sách này', type: 'error' });
        }
      }
    });
  };

  return (
    <section>
      <div className="flex-between">
        <div>
          <h2 className="page-title" style={{ margin: 0 }}>Quản lý kho sách</h2>
          <p className="section-desc">Thêm mới, cập nhật thông tin và quản lý danh mục sách.</p>
        </div>
        <button onClick={handleOpenAdd}>+ Thêm sách mới</button>
      </div>

      <div className="section-card" style={{ padding: 24, marginTop: 20 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Sách</th>
              <th>Tác giả</th>
              <th>Giá / Tồn kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.id}</td>
                <td>
                  <strong>{book.title}</strong>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{book.category_name}</div>
                </td>
                <td>{book.author}</td>
                <td>
                  <div>{Number(book.price).toLocaleString('vi-VN')} đ</div>
                  <div style={{ fontSize: 12, color: book.stock_quantity <= 5 ? '#ef4444' : '#10b981' }}>
                    Tồn: {book.stock_quantity}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="secondary-btn" style={{ padding: '6px 12px' }} onClick={() => handleOpenEdit(book)}>Sửa</button>
                    <button className="secondary-btn" style={{ padding: '6px 12px', color: '#ef4444' }} onClick={() => handleDelete(book.id)}>Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" style={{ maxWidth: 700, textAlign: 'left' }} onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">{editingBook ? 'Cập nhật sách' : 'Thêm sách mới'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
              <div className="form-group">
                <label>Tên sách</label>
                <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Tác giả</label>
                <input required value={form.author} onChange={e => setForm({...form, author: e.target.value})} />
              </div>
              <div className="form-group">
                <label>ISBN</label>
                <input value={form.isbn} onChange={e => setForm({...form, isbn: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Thể loại</label>
                <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e5e7eb' }}>
                   <option value="1">Văn học</option>
                   <option value="2">Kinh tế</option>
                   <option value="3">Kỹ năng sống</option>
                   <option value="4">Thiếu nhi</option>
                   <option value="5">Ngoại ngữ</option>
                </select>
              </div>
              <div className="form-group">
                <label>Giá bán (VNĐ)</label>
                <input type="number" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Số lượng tồn</label>
                <input type="number" required value={form.stock_quantity} onChange={e => setForm({...form, stock_quantity: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>URL Hình ảnh</label>
                <input value={form.image_url} onChange={e => setForm({...form, image_url: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Mô tả</label>
                <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e5e7eb' }} />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: 12, marginTop: 10 }}>
                <button type="submit" style={{ flex: 1 }}>{editingBook ? 'Lưu thay đổi' : 'Thêm mới'}</button>
                <button type="button" className="secondary-btn" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Hủy</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
