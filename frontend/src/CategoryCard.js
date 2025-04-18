import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import SubCategoryCard from './SubCategoryCard';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaUtensils } from 'react-icons/fa';
import axios from 'axios';
import './CategoryCard.css';

export default function CategoryCard({ category, onCategoryUpdated }) {
  const [open, setOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleDelete = e => {
    e.stopPropagation();
    if (!window.confirm(`"${category.name}" silinsin mi?`)) return;
    axios.delete(`http://127.0.0.1:8000/api/categories/${category.id}/`)
      .then(onCategoryUpdated)
      .catch(() => alert('Kategori silme hatası'));
  };

  const handleAddSub = e => {
    e.preventDefault();
    const name = e.target.elements.name.value.trim();
    const image = e.target.elements.image.files[0];
    const data = new FormData();
    data.append('name', name);
    data.append('category', category.id);
    if (image) data.append('image', image);
    axios.post('http://127.0.0.1:8000/api/subcategories/', data)
      .then(() => {
        onCategoryUpdated();
        setShowAddModal(false);
      })
      .catch(err => {
        console.error(err);
        setShowAddModal(false);
      });
  };

  const handleUpdate = e => {
    e.preventDefault();
    const name = e.target.elements.name.value.trim();
    const image = e.target.elements.image.files[0];
    const data = new FormData();
    data.append('name', name);
    if (image) data.append('image', image);
    axios.patch(`http://127.0.0.1:8000/api/categories/${category.id}/`, data)
      .then(() => {
        onCategoryUpdated();
        setShowUpdateModal(false);
      })
      .catch(err => {
        console.error(err);
        setShowUpdateModal(false);
      });
  };

  return (
    <>
      <div
        className="category-card"
        style={{ backgroundImage: `url(${category.image})` }}
      >
        <div className="overlay" onClick={() => setOpen(true)}>
          <h2>{category.name}</h2>
          
          <button>Görüntüle</button>
        </div>
      </div>

      {/* Detaylı Bilgi Modalı */}
      {open && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{category.name}</h3>
              <div className="modal-header-actions">
                <button onClick={() => setShowAddModal(true)}>
                  <FaPlus /> Alt Kategori Ekle
                </button>
                <button onClick={() => setShowUpdateModal(true)}>
                  <FaEdit /> Kategori Güncelle
                </button>
                <button onClick={handleDelete}>
                  <FaTrash /> Kategori Sil
                </button>
              </div>
            </div>

            {category.subcategories.length > 0
              ? category.subcategories.map(sc => (
                  <SubCategoryCard
                    key={sc.id}
                    subcategory={sc}
                    onSubCategoryUpdated={onCategoryUpdated}
                  />
                ))
              : <p>Henüz alt kategori yok.</p>
            }

            <button className="close-btn" onClick={() => setOpen(false)}>
              <FaTimes /> Kapat
            </button>
          </div>
        </div>,
        document.body
      )}

      {/* Alt Kategori Ekle Modal */}
      {showAddModal && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Yeni Alt Kategori</h3>
            <form onSubmit={handleAddSub}>
              <label>Ad</label>
              <input type="text" name="name" required />
              <label>Görsel (opsiyonel)</label>
              <input type="file" name="image" accept="image/*" />
              <div className="modal-footer">
                <button onClick={() => setShowAddModal(false)}>İptal</button>
                <button type="submit">Kaydet</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Kategori Güncelle Modal */}
      {showUpdateModal && ReactDOM.createPortal(
        <div className="modal-backdrop" onClick={() => setShowUpdateModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Kategori Güncelle</h3>
            <form onSubmit={handleUpdate}>
              <label>Ad</label>
              <input
                type="text"
                name="name"
                defaultValue={category.name}
                required
              />
              <label>Görsel (opsiyonel)</label>
              <input type="file" name="image" accept="image/*" />
              <div className="modal-footer">
                <button onClick={() => setShowUpdateModal(false)}>İptal</button>
                <button type="submit">Güncelle</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
