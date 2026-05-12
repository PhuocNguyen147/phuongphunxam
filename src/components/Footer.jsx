export default function Footer({ setPage, content }) {
  const brand = content?.brand;
  const services = content?.booking?.services || [
    'Điêu khắc Hairstroke',
    'Phun môi Nano',
    'Uốn mi',
    'Nối mi thiết kế',
    'Xóa sửa mày cũ',
  ];

  return (
    <footer className="container">
      <div className="footer-grid">
        <div className="footer-col">
          <a onClick={() => setPage('home')} className="logo" style={{ marginBottom: '8px' }}>
            <i className="ph-light ph-flower-lotus"></i> {brand?.name || 'Phuong Beauty'}
          </a>
          <p className="text-small">{brand?.tagline || 'Đánh thức vẻ đẹp tự nhiên bằng nghệ thuật phun xăm và nối mi chuyên nghiệp.'}</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
            <a href={brand?.facebook || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px' }}><i className="ph-light ph-facebook-logo"></i></a>
            <a href="#" style={{ fontSize: '24px' }}><i className="ph-light ph-instagram-logo"></i></a>
            <a href={brand?.tiktok || '#'} target="_blank" rel="noopener noreferrer" style={{ fontSize: '24px' }}><i className="ph-light ph-tiktok-logo"></i></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Dịch vụ</h4>
          <ul>
            {services.slice(0, 5).map((service) => (
              <li key={service}><a onClick={() => setPage('home')}>{service}</a></li>
            ))}
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
              <span>{brand?.location || 'Cần Thơ'}</span>
            </li>
            <li style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>
              <i className="ph-light ph-phone" style={{ fontSize: '18px', color: 'var(--primary)', flexShrink: 0 }}></i>
              <a href={`tel:${brand?.phoneRaw || '0939732506'}`}>{brand?.phone || '093.973.2506'}</a>
            </li>
            <li style={{ display: 'flex', gap: '8px', color: 'var(--text-muted)', fontSize: 'var(--fs-small)' }}>
              <i className="ph-light ph-clock" style={{ fontSize: '18px', color: 'var(--primary)', flexShrink: 0 }}></i>
              <span>Mở cửa: {brand?.hours || '9:00 - 20:00 (Thứ 2 - CN)'}</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
