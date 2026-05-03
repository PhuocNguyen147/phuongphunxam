import React from 'react';

export default function Header({ page, setPage, handleMobileMenu }) {
  return (
    <header>
      <nav className="container nav-inner">
        <a onClick={() => setPage('home')} className="logo">
          <i className="ph-light ph-flower-lotus"></i>
          Phương Beauty
        </a>
        
        {page === 'home' ? (
          <ul className="nav-links">
            <li><a href="#services">Dịch vụ</a></li>
            <li><a href="#gallery">Khách hàng</a></li>
            <li><a href="#pricing">Bảng giá</a></li>
            <li><a onClick={() => setPage('aftercare')}>Hướng dẫn chăm sóc</a></li>
          </ul>
        ) : (
          <a onClick={() => setPage('home')} className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: 'var(--fs-small)' }}>
            <i className="ph-light ph-arrow-left"></i> Quay lại trang chủ
          </a>
        )}

        {page === 'home' && (
          <div className="nav-actions">
            <a href="https://www.facebook.com/PhuongPhunXamThamMy/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ padding: '10px 20px' }}>Tư vấn</a>
            <a href="#booking" className="btn btn-primary" style={{ padding: '10px 20px' }}>Đặt lịch</a>
          </div>
        )}
        
        {page === 'home' && (
          <button className="mobile-toggle" onClick={handleMobileMenu}><i className="ph-light ph-list"></i></button>
        )}
      </nav>
    </header>
  );
}