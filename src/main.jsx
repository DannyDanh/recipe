import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import App from './App.jsx';
import DetailView from './DetailView.jsx'; 
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />              
        <Route path="/recipe/:id" element={<DetailView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
