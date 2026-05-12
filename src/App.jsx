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

  useEffect(() => {
    api.getContent()
      .then(setContent)
      .catch(() => setContentError('Backend chưa chạy, vui lòng bật npm run server.'));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

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
