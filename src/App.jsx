import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Aftercare from './pages/Aftercare';
import './App.css';

export default function App() {
  const [page, setPage] = useState('home');
  const [lightboxImg, setLightboxImg] = useState(null);

  const openLightbox = (src) => setLightboxImg(src);
  const closeLightbox = () => setLightboxImg(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handleMobileMenu = () => {
    alert('Chức năng menu mobile sẽ mở ra một popup/drawer tại đây.');
  };

  return (
    <>
      <Header page={page} setPage={setPage} handleMobileMenu={handleMobileMenu} />

      {/* Hiển thị trang dựa vào state */}
      {page === 'home' ? <Home openLightbox={openLightbox} /> : <Aftercare />}

      <Footer setPage={setPage} />

      {/* Lightbox Xem Ảnh dùng chung */}
      {lightboxImg && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="lightbox-close" onClick={closeLightbox}>&times;</span>
          <img className="lightbox-content" src={lightboxImg} alt="Phóng to" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </>
  );
}