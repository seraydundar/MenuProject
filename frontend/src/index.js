// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import MealHistoryEditor from './MealHistoryEditor';
import reportWebVitals from './reportWebVitals';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/meals/:id/history-edit" element={<MealHistoryEditor />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
