import { useState } from 'react';

export default function Header({ page, setPage, content }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const brand = content?.brand;

  const handleLinkClick = (pageName) => {
    setPage(pageName);
    setIsMobileMenuOpen(false);
  };

  return (
    <header>
      <nav className="container nav-inner">
        <a onClick={() => handleLinkClick('home')} className="logo">
          <i className="ph-light ph-flower-lotus"></i>
          {brand?.name || 'Phuong Beauty'}
        </a>

        {page === 'home' ? (
          <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
            <li><a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Dịch vụ</a></li>
            <li><a href="#gallery" onClick={() => setIsMobileMenuOpen(false)}>Khách hàng</a></li>
            <li><a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Bảng giá</a></li>
            <li><a onClick={() => handleLinkClick('aftercare')}>Hướng dẫn chăm sóc</a></li>
          </ul>
        ) : (
          <a onClick={() => handleLinkClick('home')} className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: 'var(--fs-small)' }}>
            <i className="ph-light ph-arrow-left"></i> Quay lại trang chủ
          </a>
        )}

        {page === 'home' && (
          <div className="nav-actions">
            <a href={brand?.facebook || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '10px 20px' }}>Tư vấn</a>
            <a href="#booking" className="btn btn-primary" style={{ padding: '10px 20px' }}>Đặt lịch</a>
          </div>
        )}

        {page === 'home' && (
          <button className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Mở menu">
            <i className={`ph-light ${isMobileMenuOpen ? 'ph-x' : 'ph-list'}`}></i>
          </button>
        )}
      </nav>
    </header>
  );
}
