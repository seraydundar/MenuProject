import React, { useState } from 'react';
import axios from 'axios';
import { FaUtensils } from 'react-icons/fa';
import './AddMeal.css';

function AddMeal({ fixedSubCategory, onMealAdded }) {
  const [formData, setFormData] = useState({
    sub_category: fixedSubCategory || '',
    name: '',
    konu_anlatimi: '',
    mevzuat: '',
    fiyat: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');
  const [preview, setPreview] = useState(null);

  // Form alanlarını güncelle
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Seçilen dosya için önizleme
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

  // Form gönderimi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.sub_category) {
      setMessage('Lütfen bir alt kategori seçin.');
      return;
    }

    const data = new FormData();
    data.append('sub_category', formData.sub_category);
    data.append('name', formData.name);
    data.append('konu_anlatimi', formData.konu_anlatimi);
    //data.append('mevzuat', formData.mevzuat);
    data.append('fiyat', formData.fiyat);
    if (imageFile) {
      data.append('image', imageFile);
    }

    axios.post('http://127.0.0.1:8000/api/meals/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
      .then(response => {
        setMessage('Yeni yemek başarıyla eklendi!');
        setFormData({
          sub_category: fixedSubCategory || '',
          name: '',
          konu_anlatimi: '',
          //mevzuat: '',
          fiyat: ''
        });
        setImageFile(null);
        setPreview(null);
        onMealAdded();
      })
      .catch(error => {
        console.error('Yemek eklenirken hata:', error);
        setMessage('Yemek eklenirken bir hata oluştu.');
      });
  };

  return (
    <div className="add-meal-container">
      <div className="add-meal-header">
        <h3>
          <FaUtensils className="meal-icon" />
          Yeni Yemek Ekle
        </h3>
      </div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        {/* fixedSubCategory varsa alt kategori seçimini gizle */}
        {!fixedSubCategory && (
          <div className="form-group">
            <label>Alt Kategori:</label>
            <input
              type="text"
              name="sub_category"
              value={formData.sub_category}
              onChange={handleChange}
              placeholder="Alt kategori ID'si girin"
              required
            />
          </div>
        )}
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
          <label>İçerik:</label>
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
            step="5"
            required
          />
        </div>
        <div className="form-group">
          <label>Görsel:</label>
          <input type="file" name="image" onChange={handleFileChange} />
        </div>
        {preview && (
          <div className="preview-container">
            <p>Seçilen Görsel Önizlemesi:</p>
            <img src={preview} alt="Önizleme" className="preview-image" />
          </div>
        )}
        <button type="submit" className="submit-btn">Ekle</button>
      </form>
    </div>
  );
}

export default AddMeal;
