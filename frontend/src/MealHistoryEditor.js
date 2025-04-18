// src/MealHistoryEditor.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize-module-react';
import axios from 'axios';
import './MealHistoryEditor.css';

// 1) Register image‑resize module
Quill.register('modules/imageResize', ImageResize);

// 2) Whitelist 10pt–72pt in 2pt increments
const SizeStyle = Quill.import('attributors/style/size');
const sizeValues = Array.from(
  { length: ((72 - 10) / 2 + 1) },
  (_, i) => `${10 + 2 * i}pt`
);
SizeStyle.whitelist = sizeValues;
Quill.register(SizeStyle, true);

const API_BASE = 'http://127.0.0.1:8000/api/meal-histories/';

export default function MealHistoryEditor() {
  const { id: mealId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');

  // Mevcut içeriği yükle
  useEffect(() => {
    const idNum = Number(mealId);
    if (isNaN(idNum)) return;
    axios
      .get(API_BASE, { params: { meal: idNum } })
      .then(res => {
        if (res.data?.length) setContent(res.data[0].content);
      })
      .catch(console.error);
  }, [mealId]);

  // Kaydet işlemi
  const handleSave = () => {
    const idNum = Number(mealId);
    if (isNaN(idNum)) return;
    const form = new FormData();
    form.append('meal', idNum);
    form.append('content', content);
    axios
      .post(API_BASE, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(() => navigate(-1))
      .catch(console.error);
  };

  const modules = {
    toolbar: [
      [{ size: sizeValues }],
      ['bold','italic','underline','strike'],
      [{ color: [] }, { background: [] }],
      ['image'],
      [{ list: 'ordered' }, { list: 'bullet' }]
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize','DisplaySize','Toolbar']
    }
  };

  const formats = [
    'size','bold','italic','underline','strike',
    'color','background','image','list','bullet'
  ];

  return (
    <div className="history-editor">
      <div className="page-container">
        <div className="react-quill">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
          />
        </div>

        <div className="editor-footer">
          <button
            type="button"
            className="btn-back"
            onClick={() => navigate(-1)}
          >
            İptal
          </button>
          <button
            type="button"
            className="btn-save"
            onClick={handleSave}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
