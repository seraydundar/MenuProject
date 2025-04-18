import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import UpdateMeal from './UpdateMeal';
import AddMeal from './AddMeal';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import './SubCategoryCard.css';

const MEAL_HISTORY_API = 'http://127.0.0.1:8000/api/meal-histories/';

export default function SubCategoryCard({ subcategory, onSubCategoryUpdated }) {
  const [detailModal, setDetailModal] = useState(false);
  const [showUpdateMealModal, setShowUpdateMealModal] = useState(false);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selMeal, setSelMeal] = useState(null);
  const [historyContent, setHistoryContent] = useState('');
  const navigate = useNavigate();

  // Alt kategoriyi sil
  const handleDeleteSub = e => {
    e.stopPropagation();
    if (!window.confirm(`"${subcategory.name}" silinsin mi?`)) return;
    axios
      .delete(`http://127.0.0.1:8000/api/subcategories/${subcategory.id}/`)
      .then(onSubCategoryUpdated)
      .catch(() => alert('Alt kategori silme hatası'));
  };

  // Yeni yemek ekle modalını aç
  const openAddMeal = e => {
    e.stopPropagation();
    setShowAddMealModal(true);
  };

  // Yemek detay modalını aç
  const openDetail = meal => {
    setSelMeal(meal);
    setDetailModal(true);
  };

  // useEffect ile seçilen yemeğin tarihçesini çek
  useEffect(() => {
    if (!selMeal) return;

    axios
      .get(MEAL_HISTORY_API, { params: { meal: selMeal.id } })
      .then(res => {
        if (res.data && res.data.length > 0) {
          setHistoryContent(res.data[0].content);
        } else {
          // Eğer history yoksa modeldeki mevzuatı göster
          setHistoryContent(selMeal.mevzuat || '');
        }
      })
      .catch(err => {
        console.error('History getirilemedi:', err);
        setHistoryContent(selMeal.mevzuat || '');
      });
  }, [selMeal]);

  // Yemek sil
  const handleDeleteMeal = mealId => {
    if (!window.confirm('Bu yemeği silmek istediğinize emin misiniz?')) return;
    axios
      .delete(`http://127.0.0.1:8000/api/meals/${mealId}/`)
      .then(() => {
        onSubCategoryUpdated();
        setDetailModal(false);
      })
      .catch(() => alert('Yemek silme hatası'));
  };

  return (
    <div className="subcategory-card">
      <div className="subcat-header" onClick={e => e.stopPropagation()}>
        <h4>{subcategory.name}</h4>
        <div className="subcat-header-actions">
          <button onClick={openAddMeal}><FaPlus /></button>
          <button onClick={handleDeleteSub} className="btn-delete"><FaTrash /></button>
        </div>
      </div>

      <div className="card-body">
        {subcategory.meals.length > 0 ? (
          subcategory.meals.map(meal => (
            <div
              key={meal.id}
              className="meal-item"
              onClick={() => openDetail(meal)}
            >
              {meal.image
                ? <img src={meal.image} alt={meal.name} />
                : <div className="meal-image-placeholder" />}
              <div className="meal-info">
                <strong>{meal.name}</strong>
                <p>{meal.konu_anlatimi}</p>
                <small>{meal.fiyat} TL</small>
              </div>
            </div>
          ))
        ) : (
          <p className="empty">Henüz yemek yok.</p>
        )}
      </div>

      {/* Detay Modal */}
      {detailModal && selMeal && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setDetailModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{selMeal.name}</h3>
            {selMeal.image && (
              <img src={selMeal.image} alt={selMeal.name} className="detail-image" />
            )}

            <div className="detail-section">
              <h4>İçerik</h4>
              <p>{selMeal.konu_anlatimi}</p>
            </div>

            <div className="detail-section">
              <h4>Tarihçe</h4>
              {historyContent
                ? <div dangerouslySetInnerHTML={{ __html: historyContent }} />
                : <p>Yok</p>
              }
            </div>

            <div className="detail-section">
              <h4>Fiyat</h4>
              <p>{selMeal.fiyat} TL</p>
            </div>

            <div className="detail-btn-group">
              <button
                onClick={() => {
                  setDetailModal(false);
                  navigate(`/meals/${selMeal.id}/history-edit`);
                }}
                className="update-meal-btn"
              >
                <FaEdit /> Tarihçe Düzenle
              </button>
              <button
                onClick={() => {
                  setDetailModal(false);
                  setShowUpdateMealModal(true);
                }}
                className="update-meal-btn"
              >
                <FaEdit /> Düzenle
              </button>
              <button
                onClick={() => handleDeleteMeal(selMeal.id)}
                className="delete-meal-btn"
              >
                <FaTrash /> Sil
              </button>
              <button
                onClick={() => setDetailModal(false)}
                className="close-modal-btn"
              >
                <FaTimes /> Kapat
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Yemek Güncelleme Modalı */}
      {showUpdateMealModal && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowUpdateMealModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>{selMeal.name} Düzenle</h3>
            <UpdateMeal
              mealId={selMeal.id}
              onUpdateSuccess={() => {
                setShowUpdateMealModal(false);
                onSubCategoryUpdated();
              }}
              onCancel={() => setShowUpdateMealModal(false)}
            />
          </div>
        </div>,
        document.body
      )}

      {/* Yeni Yemek Ekle Modalı */}
      {showAddMealModal && ReactDOM.createPortal(
        <div className="modal-overlay" onClick={() => setShowAddMealModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Yeni Yemek Ekle</h3>
            <AddMeal
              fixedSubCategory={subcategory.id}
              onMealAdded={() => {
                setShowAddMealModal(false);
                onSubCategoryUpdated();
              }}
            />
            <button
              onClick={() => setShowAddMealModal(false)}
              className="close-modal-btn"
            >
              <FaTimes /> Kapat
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
