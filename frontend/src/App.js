// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaPlus, FaTimes, FaUtensils } from 'react-icons/fa';
import CategoryCard from './CategoryCard';
import './App.css';

export default function App() {
  const [categories, setCategories]     = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(fetchCategories, []);

  function fetchCategories() {
    setLoading(true);
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => { setCategories(res.data); setError(''); })
      .catch(() => setError('Kategoriler alınırken hata oluştu.'))
      .finally(() => setLoading(false));
  }

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) return;
    const items = Array.from(categories);
    const [moved] = items.splice(source.index, 1);
    items.splice(destination.index, 0, moved);
    setCategories(items);
    // TODO: Yeni sıralamayı backend'e PATCH ile gönder
  }

  function handleAddCategory(e) {
    e.preventDefault();
    const name      = e.target.elements.name.value.trim();
    const imageFile = e.target.elements.image.files[0];
    if (!name) return;

    const form = new FormData();
    form.append('name', name);
    if (imageFile) form.append('image', imageFile);

    axios.post('http://127.0.0.1:8000/api/categories/', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(() => {
      fetchCategories();
      setShowAddModal(false);
    })
    .catch(() => {
      alert('Kategori eklerken bir hata oluştu.');
      setShowAddModal(false);
    });
  }

  return (
    <div className="app-container">
      {/* Başlık */}
      <h1 className="main-title">
        <FaUtensils className="main-title-icon" />
        Lokanta Menü Yönetimi
      </h1>

      {loading && <p className="status-message">Yükleniyor...</p>}
      {error   && <p className="status-message error">{error}</p>}

      {!loading && !error && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                className="cards-grid"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {categories.map((cat, idx) => (
                  <Draggable key={cat.id} draggableId={String(cat.id)} index={idx}>
                    {(prov) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        {...prov.dragHandleProps}
                      >
                        <CategoryCard
                          category={cat}
                          onCategoryUpdated={fetchCategories}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Floating “Yeni Kategori Ekle” Butonu */}
      <button className="fab" onClick={() => setShowAddModal(true)}>
        <FaPlus />
      </button>

      {/* Yeni Kategori Modalı */}
      {showAddModal && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Yeni Kategori Ekle</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleAddCategory}>
              <label>Kategori Adı</label>
              <input
                type="text"
                name="name"
                placeholder="Örneğin: Çorbalar"
                required
              />
              <label>Görsel (opsiyonel)</label>
              <input type="file" name="image" accept="image/*" />
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddModal(false)}
                >
                  İptal
                </button>
                <button type="submit" className="btn-save">
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
