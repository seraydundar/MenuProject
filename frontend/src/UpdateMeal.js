import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import './UpdateMeal.css';

function UpdateMeal({ mealId, onUpdateSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    konu_anlatimi: '',
    mevzuat: '',
    fiyat: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');

  // Mevcut yemeğin bilgisini çekiyoruz.
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/meals/${mealId}/`)
      .then((res) => {
        setFormData({
          name: res.data.name || '',
          konu_anlatimi: res.data.konu_anlatimi || '',
          mevzuat: res.data.mevzuat || '',
          fiyat: res.data.fiyat || '',
        });
      })
      .catch((err) => {
        console.error('Yemek bilgisi alınırken hata:', err);
        setMessage('Yemek bilgisi alınırken bir hata oluştu.');
      });
  }, [mealId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImageFile(file);
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('konu_anlatimi', formData.konu_anlatimi);
    data.append('mevzuat', formData.mevzuat);
    data.append('fiyat', formData.fiyat);
    if (imageFile) {
      data.append('image', imageFile);
    }
    axios.patch(`http://127.0.0.1:8000/api/meals/${mealId}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((res) => {
        setMessage('Yemek başarıyla güncellendi!');
        onUpdateSuccess(); 
      })
      .catch((err) => {
        console.error('Yemek güncellenirken hata:', err);
        setMessage('Yemek güncellenirken bir hata oluştu.');
      });
  };

  return (
    <div className="update-meal-container">
      <div className="update-meal-header">
        <h3>
          <FaEdit className="meal-icon" />
          Yemek Güncelle
        </h3>
      </div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label>Yemek Adı:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            required 
          />
        </div>
        <div className="form-group">
          <label>Konu Anlatımı:</label>
          <textarea
            name="konu_anlatimi"
            value={formData.konu_anlatimi}
            onChange={handleChange}
            rows={3}
            required
          />
        </div>
        <div className="form-group">
          <label>Fiyat:</label>
          <input
            type="number"
            name="fiyat"
            value={formData.fiyat}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Fotoğraf Güncelle (Opsiyonel):</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        {preview && (
          <div className="preview-container">
            <p>Seçilen Görsel Önizlemesi:</p>
            <img src={preview} alt="Önizleme" className="preview-image" />
          </div>
        )}
        <div className="btn-group">
          <button type="submit" className="save-btn">Kaydet</button>
          <button type="button" className="cancel-btn" onClick={onCancel}>İptal</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateMeal;
