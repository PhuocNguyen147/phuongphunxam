import React from 'react';

export default function Footer({ setPage }) {
  return (
    <footer className="container">
      <div className="footer-grid">
        <div className="footer-col">
          <a onClick={() => setPage('home')} className="logo" style={{ marginBottom: '8px' }}>
            <i className="ph-light ph-flower-lotus"></i> Phương Beauty
          </a>
          <p className="text-small">Đánh thức vẻ đẹp tự nhiên ẩn sâu bên trong bạn bằng nghệ thuật phun xăm phong thủy và nối mi thiết kế chuyên nghiệp.</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <a href="https://www.facebook.com/phuongphuongnoimi" target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px' }}><i className="ph-light ph-facebook-logo"></i></a>
            <a href="#" style={{ fontSize: '24px' }}><i className="ph-light ph-instagram-logo"></i></a>
            <a href="https://www.tiktok.com/@phuongphunxamnoimi?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px' }}><i className="ph-light ph-tiktok-logo"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Dịch vụ</h4>
          <ul>
            <li><a onClick={() => setPage('home')}>Điêu khắc Hairstroke</a></li>
            <li><a onClick={() => setPage('home')}>Phun mày Shading</a></li>
            <li><a onClick={() => setPage('home')}>Phun môi Nano / Collagen</a></li>
            <li><a onClick={() => setPage('home')}>Uốn mi / Nối mi thiết kế</a></li>
            <li><a onClick={() => setPage('home')}>Xóa sửa mày cũ</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a onClick={() => setPage('aftercare')}>Hướng dẫn chăm sóc</a></li>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
            <li><a onClick={() => setPage('home')}>Bảng giá chi tiết</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Liên hệ</h4>
          <ul>
            <li style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>
              <i className="ph-light ph-map-pin" style={{ fontSize: '18px', color: 'var(--primary)', flexShrink: 0 }}></i>
              <span>Cần Thơ</span>
            </li>
            <li style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>
              <i className="ph-light ph-phone" style={{ fontSize: '18px', color: 'var(--primary)', flexShrink: 0 }}></i>
              <a href="tel:0939732506">093.973.2506</a>
            </li>
            <li style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>
              <i className="ph-light ph-clock" style={{ fontSize: '18px', color: 'var(--primary)', flexShrink: 0 }}></i>
              <span>Mở cửa: 9:00 - 20:00 (Thứ 2 - CN)</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}