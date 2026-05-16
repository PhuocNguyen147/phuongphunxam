import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Aftercare from './pages/Aftercare';
import Admin from './pages/Admin';
import { api } from './api';
import './App.css';

export default function App() {
  const [page, setPage] = useState(window.location.pathname === '/admin' ? 'admin' : 'home');
  const [lightboxImg, setLightboxImg] = useState(null);
  const [content, setContent] = useState(null);
  const [contentError, setContentError] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    api.getContent()
      .then(setContent)
      .catch(() => setContentError('Backend chưa chạy, vui lòng bật npm run server.'));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    const updateBackToTop = () => setShowBackToTop(window.scrollY > 420);
    updateBackToTop();
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    return () => window.removeEventListener('scroll', updateBackToTop);
  }, []);

  return (
    <>
      {page !== 'admin' && <Header page={page} setPage={setPage} content={content} />}

      {contentError && <div className="server-alert">{contentError}</div>}

      {page === 'admin' ? (
        <Admin key={content ? 'admin-ready' : 'admin-loading'} initialContent={content} setContent={setContent} />
      ) : page === 'home' ? (
        <Home content={content} openLightbox={setLightboxImg} />
      ) : (
        <Aftercare content={content} />
      )}

      {page !== 'admin' && <Footer setPage={setPage} content={content} />}

      {page !== 'admin' && showBackToTop && (
        <button
          aria-label="Quay về đầu trang"
          className="back-to-top"
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <i className="ph-light ph-arrow-up"></i>
        </button>
      )}

      {lightboxImg && (
        <div className="lightbox" onClick={() => setLightboxImg(null)}>
          <span className="lightbox-close" onClick={() => setLightboxImg(null)}>&times;</span>
          <img
            className="lightbox-content"
            src={lightboxImg}
            alt="Phóng to"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
