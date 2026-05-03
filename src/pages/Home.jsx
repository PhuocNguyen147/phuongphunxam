import React from 'react';

export default function Home({ openLightbox }) {
  return (
    <main className="section-gap">
      {/* 2. Hero Section */}
      <section className="hero container section-padding">
        <div className="label-pill">
          <div className="dot-pulse"></div>
          Ưu đãi 20% cho khách hàng mới
        </div>
        <h1 className="display-text text-balance">Đánh thức vẻ đẹp tự nhiên của bạn.</h1>
        <p className="text-balance" style={{ maxWidth: '600px', fontSize: '1.125rem' }}>Nghệ thuật phun xăm phong thủy và nối mi thiết kế tinh tế. Mang lại diện mạo rạng rỡ, tự tin không cần trang điểm mỗi ngày.</p>
        <div className="hero-actions">
          <a href="#booking" className="btn btn-primary">Đặt lịch ngay <i className="ph-light ph-arrow-right"></i></a>
          <a href="#pricing" className="btn btn-ghost">Xem bảng giá</a>
        </div>
      </section>

      {/* 3. Dịch vụ */}
      <section id="services" className="container">
        <div className="bento-grid">
          <div className="bento-card main-srv-1">
            <h2 className="text-balance">Nghệ thuật Phun Xăm Tự Nhiên</h2>
            <p style={{ maxWidth: '80%' }}>Sử dụng kỹ thuật hiện đại tạo hạt vi chạm, điêu khắc sợi siêu thực. Cam kết mực Organic 100% nhập khẩu, giữ màu trong trẻo, tuyệt đối không trổ xanh đỏ theo thời gian.</p>
            <div style={{ flexGrow: 1, display: 'flex', gap: '16px', marginTop: '24px' }}>
              <div style={{ flex: 1, borderRadius: 'var(--radius-inner)', overflow: 'hidden', position: 'relative', minHeight: '200px' }}>
                <div className="label-pill" style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', fontSize: '12px', zIndex: 2, background: 'rgba(255,255,255,0.9)', boxShadow: 'none' }}>Trước</div>
                <img src="https://i.ibb.co/WwJnKpw/z7779157856570-c416fcf2a73ba9f74dc4e7daf8e6a461.jpg" alt="Trước" className="clickable-img" onClick={(e) => openLightbox(e.target.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              </div>
              <div style={{ flex: 1, borderRadius: 'var(--radius-inner)', overflow: 'hidden', position: 'relative', minHeight: '200px' }}>
                <div className="label-pill" style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 12px', fontSize: '12px', zIndex: 2, background: 'rgba(255,255,255,0.9)', color: 'var(--primary)', boxShadow: 'none' }}>Sau</div>
                <img src="https://i.ibb.co/5xst28zD/z7779157849251-30681f8e58ac95771d2472f22e029c73.jpg" alt="Sau" className="clickable-img" onClick={(e) => openLightbox(e.target.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
              </div>
            </div>
          </div>
          <div className="bento-card bg-primary main-srv-2">
            <i className="ph-light ph-eye card-icon"></i>
            <h3>Nối Mi Thiết Kế</h3>
            <p>Đa dạng phong cách: Classic tự nhiên, Volume quyến rũ, Katun cá tính. Thiết kế dáng mi phù hợp với từng dáng mắt.</p>
          </div>
          <div className="bento-card main-srv-3">
            <i className="ph-light ph-plant card-icon"></i>
            <h3>Mực 100% Organic</h3>
            <p>Chiết xuất từ thiên nhiên, an toàn tuyệt đối cho da nhạy cảm. Màu sắc tươi tắn, bền đẹp từ 2-3 năm.</p>
          </div>
          <div className="bento-card main-srv-4 text-center" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ fontSize: '3rem', color: 'var(--primary)' }}>5000+</h2>
            <p className="text-small">Khách hàng hài lòng</p>
          </div>
          <div className="bento-card main-srv-5 text-center" style={{ justifyContent: 'center', alignItems: 'center' }}>
            <h2 style={{ fontSize: '3rem', color: 'var(--primary)' }}>100%</h2>
            <p className="text-small">Dụng cụ vô trùng</p>
          </div>
          <div className="bento-card bg-dark main-srv-6">
            <h3 style={{ fontStyle: 'italic', fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4, textWrap: 'balance' }}>"Làm đẹp không sưng, không đau, không cần nghỉ dưỡng. Thức dậy là đã xinh đẹp."</h3>
            <div className="avatar-group">
              <img src="https://i.ibb.co/2YLx2GSQ/671238164-122175271484674409-489046803376587283-n.jpg" alt="Master Phương" className="avatar" style={{ objectFit: 'cover' }} />
              <div>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 600 }}>Master Phương</p>
                <p className="text-small" style={{ margin: 0 }}>Founder & Chuyên gia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Quy trình Y Khoa */}
      <section className="container section-padding">
        <div className="deep-dive-grid">
          <div className="deep-dive-text" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <span style={{ fontSize: 'var(--fs-small)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--primary)' }}>Tại sao chọn chúng tôi?</span>
            <h2>Quy trình chuẩn Y khoa</h2>
            <p>Sự an toàn và sức khỏe của khách hàng luôn được đặt lên hàng đầu. Mọi dụng cụ đều được tiệt trùng 100% bằng máy hấp chuyên dụng trước khi thực hiện.</p>
            <ul className="check-list">
              <li><i className="ph-light ph-check-circle"></i><div><strong>Tư vấn dáng mày phong thủy</strong><p className="text-small">Đo vẽ tỷ lệ vàng phù hợp khuôn mặt.</p></div></li>
              <li><i className="ph-light ph-check-circle"></i><div><strong>Dụng cụ riêng biệt</strong><p className="text-small">Mỗi khách hàng sử dụng 1 bộ kim riêng, bóc mới 100%.</p></div></li>
              <li><i className="ph-light ph-check-circle"></i><div><strong>Chăm sóc hậu phẫu tận tâm</strong><p className="text-small">Theo dõi sát sao quá trình bong mài và phục hồi.</p></div></li>
            </ul>
          </div>
          <div className="deep-dive-bento">
            <div className="bento-card" style={{ padding: 'var(--pad-card-mb)' }}><h2 style={{ color: 'var(--primary)', marginBottom: '8px' }}>FDA</h2><p className="text-small">Mực xăm đạt chứng nhận FDA Hoa Kỳ an toàn cho sức khỏe.</p></div>
            <div className="bento-card" style={{ padding: 'var(--pad-card-mb)' }}><i className="ph-light ph-certificate card-icon"></i><h4 style={{ marginBottom: '8px' }}>Chứng chỉ Quốc tế</h4><p className="text-small">Kỹ thuật viên được đào tạo bài bản chuyên nghiệp.</p></div>
            <div className="bento-card" style={{ padding: 'var(--pad-card-mb)' }}><i className="ph-light ph-drop card-icon"></i><h4 style={{ marginBottom: '8px' }}>Không gây tổn thương</h4><p className="text-small">Kỹ thuật chạm hạt nhẹ nhàng trên bề mặt da.</p></div>
            <div className="bento-card bg-primary" style={{ padding: 'var(--pad-card-mb)' }}><i className="ph-light ph-shield-check card-icon" style={{ color: 'white' }}></i><h4 style={{ marginBottom: '8px' }}>Bảo hành trọn đời</h4><p className="text-small">Cam kết chất lượng màu sắc không biến đổi.</p></div>
          </div>
        </div>
      </section>

      {/* 5. Giải thưởng */}
      <section className="container section-padding" style={{ paddingTop: 0 }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h2>Khẳng định uy tín & chuyên môn</h2>
          <p>Liên tục tu nghiệp chuyên sâu và đạt thành tích xuất sắc tại các cuộc thi sắc đẹp trong & ngoài nước.</p>
        </div>
        <div className="bento-grid">
          <div className="bento-card award-card" style={{ padding: 0, minHeight: '350px' }}><img src="https://i.ibb.co/5XBtL82C/487495267-2731096240416732-5354937048691445811-n.jpg" className="clickable-img" onClick={(e) => openLightbox(e.target.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} /></div>
          <div className="bento-card award-card" style={{ padding: 0, minHeight: '350px' }}><img src="https://i.ibb.co/fV2HyfRc/487326413-2731096443750045-6403955405240353925-n.jpg" className="clickable-img" onClick={(e) => openLightbox(e.target.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} /></div>
          <div className="bento-card award-card" style={{ padding: 0, minHeight: '350px' }}><img src="https://i.ibb.co/xKJnhCbv/486612555-2731096433750046-5300749428696946604-n.jpg" className="clickable-img" onClick={(e) => openLightbox(e.target.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} /></div>
        </div>
      </section>

      {/* 6. Gallery */}
      <section id="gallery" className="container">
        <div className="section-header">
          <h2>Tỏa sáng theo cách riêng của bạn.</h2>
          <p>Khám phá những sự thay đổi tuyệt vời từ khách hàng của Phương Beauty.</p>
        </div>
        <div className="bento-grid">
          <div className="bento-card gal-1" style={{ padding: '16px' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: 'var(--radius-inner)', overflow: 'hidden', minHeight: '300px' }}>
              <img src="https://i.ibb.co/nMjPDPFj/666469468-3099752526884433-3488216475981925523-n.jpg" className="clickable-img" onClick={(e) => openLightbox(e.target.src)} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
            </div>
          </div>
          <div className="bento-card gal-2 text-center" style={{ justifyContent: 'center', alignItems: 'center' }}><i className="ph-light ph-pen-nib card-icon" style={{ fontSize: '48px' }}></i><h4 style={{ marginTop: '16px' }}>Điêu khắc Hairstroke</h4></div>
          <div className="bento-card gal-3 text-center" style={{ justifyContent: 'center', alignItems: 'center' }}><i className="ph-light ph-lips card-icon" style={{ fontSize: '48px' }}></i><h4 style={{ marginTop: '16px' }}>Phun môi Nano</h4></div>
          <div className="bento-card gal-4 text-center" style={{ justifyContent: 'center', alignItems: 'center' }}><i className="ph-light ph-magic-wand card-icon" style={{ fontSize: '48px' }}></i><h4 style={{ marginTop: '16px' }}>Mi thiết kế</h4></div>
          <div className="bento-card bg-primary gal-5 text-center" style={{ justifyContent: 'center', alignItems: 'center' }}><i className="ph-light ph-gift card-icon" style={{ fontSize: '48px', color: 'white' }}></i><h4 style={{ marginTop: '16px' }}>Dặm lại miễn phí</h4></div>
        </div>
      </section>

      {/* 7. Lash Collection */}
      <section className="container section-padding" style={{ paddingTop: 0 }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h2>Bộ sưu tập Nối Mi Thiết Kế</h2>
          <p>Những đôi mắt hút hồn với hàng mi cong vút, tự nhiên nhưng không kém phần quyến rũ tại Phương Beauty.</p>
        </div>
        <div className="bento-grid">
          {['bRXx2RYC/z7779183453115-5dd7732ca96f7672e4c46da52862489b.jpg', 'N61GSx1M/z7779183459823-c4376e7e1338a12648878a0de447d9a4.jpg' ,'Dg9pJxGZ/z7779183467001-85a3c8355dae5c03123515eeb417eefc.jpg', ].map((img, i) => (
            <div key={i} className="bento-card lash-card-3 lash-card" style={{ padding: 0, minHeight: '300px' }}>
              <div className="img-zoom-wrapper"><img src={`https://i.ibb.co/${img}`} className="clickable-img" onClick={(e) => openLightbox(e.target.src)} /></div>
            </div>
          ))}
         
          {['rG2cpqq4/z7779183481247-738a89327d15a80842bfbabd44cb21db.jpg', 'jv3K71QW/z7779183487808-ae1190a5d7b70415228f3cfcc954ef65.jpg'].map((img, i) => (
            <div key={i} className="bento-card lash-card-2 lash-card" style={{ padding: 0, minHeight: '350px' }}>
              <div className="img-zoom-wrapper"><img src={`https://i.ibb.co/${img}`} className="clickable-img" onClick={(e) => openLightbox(e.target.src)} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Công nghệ */}
      <section className="container section-padding">
        <div className="section-header"><h2>Công nghệ hiện đại nhất.</h2></div>
        <div className="bento-grid">
          <div className="bento-card tech-card text-center" style={{ alignItems: 'center' }}><i className="ph-light ph-flask card-icon"></i><h4>Mực nhập khẩu</h4><p className="text-small">Từ Đức & Nga</p></div>
          <div className="bento-card tech-card text-center" style={{ alignItems: 'center' }}><i className="ph-light ph-crosshair card-icon"></i><h4>Máy phun thần thánh</h4><p className="text-small">Hạn chế tổn thương tối đa</p></div>
          <div className="bento-card tech-card text-center" style={{ alignItems: 'center' }}><i className="ph-light ph-feather card-icon"></i><h4>Keo mi cao cấp</h4><p className="text-small">Chống cay, chống dị ứng</p></div>
          <div className="bento-card tech-card text-center" style={{ alignItems: 'center' }}><i className="ph-light ph-armchair card-icon"></i><h4>Không gian thư giãn</h4><p className="text-small">Thoải mái như ở nhà</p></div>
        </div>
      </section>

      {/* 9. Feedback chữ */}
      <section className="container">
        <div className="bento-grid">
          <div className="bento-card testi-main" style={{ justifyContent: 'space-between' }}>
            <i className="ph-light ph-quotes card-icon" style={{ opacity: 0.3, fontSize: '64px', position: 'absolute', top: '24px', right: '24px' }}></i>
            <h3 style={{ fontSize: '2rem', fontStyle: 'italic', zIndex: 1, maxWidth: '90%' }}>"Mày làm xong tự nhiên đến mức bạn bè không ai biết mình đi xăm. Mi nối thì siêu nhẹ mắt, giữ được hơn 1 tháng luôn. Rất ưng ý dịch vụ ở đây!"</h3>
            <div className="avatar-group" style={{ zIndex: 1 }}>
              <img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%23F0EAE1'/><text x='50' y='65' font-family='Arial' font-size='40' text-anchor='middle' fill='%23B76E79'>L</text></svg>" alt="Avatar" className="avatar" />
              <div><p style={{ margin: 0, color: 'var(--text-dark)', fontWeight: 600 }}>Lan Anh</p><p className="text-small" style={{ margin: 0 }}>Khách hàng Nối Mi & Điêu Khắc Mày</p></div>
            </div>
          </div>
          <div className="bento-card testi-sub">
            <p style={{ fontStyle: 'italic', flexGrow: 1 }}>"Môi bong ra màu cam đào siêu xinh, không bị sưng tều chút nào. Master Phương làm rất nhẹ nhàng."</p>
            <div className="avatar-group"><div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>M</div><p className="text-small" style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>Minh Tú</p></div>
          </div>
          <div className="bento-card testi-sub">
            <p style={{ fontStyle: 'italic', flexGrow: 1 }}>"Không gian sạch sẽ, dụng cụ bóc mới trước mặt mình nên rất yên tâm. Sẽ giới thiệu bạn bè."</p>
            <div className="avatar-group"><div className="avatar" style={{ width: '36px', height: '36px', fontSize: '14px' }}>H</div><p className="text-small" style={{ margin: 0, fontWeight: 600, color: 'var(--text-dark)' }}>Hương Ly</p></div>
          </div>
        </div>
      </section>

      {/* 10. Feedback Hình Ảnh */}
      <section className="container section-padding" style={{ paddingTop: 0 }}>
        <div className="section-header" style={{ marginBottom: '32px' }}>
          <h2>Phản hồi chân thực</h2>
          <p>Hàng ngàn tin nhắn yêu thương và sự hài lòng tuyệt đối từ khách hàng của Phương Beauty.</p>
        </div>
        <div className="bento-grid">
          {['q3PS0Zmn/z7779108936970-2f8d04bcd0d55ed34d854be1acb36f52.jpg', 'gBbrdfS/z7779108942743-95a4129a1d40a4e467be99779ee16002.jpg', 'PZRg23Xy/z7779108946636-4df61a5913e2b3caca6032dc225cb09a.jpg', 'ksMS4CfT/z7779108950236-2b1cd67d837e65b3ac55adff8d66de50.jpg', '84dvBm7Y/z7779108955634-c4a974d9d68009edf8a4b4c58566025a.jpg', '4ws4LVgf/z7779108960288-e957415978e6ab60fcd9cb15568f02a2.jpg', 'Nnrt5mYn/z7779108964754-742fc9542fa2415339982491c78f0051.jpg', 'trPGtMC/z7779108971511-a87b57402b72da90c45a0183cac29641.jpg'].map((img, i) => (
            <div key={i} className="bento-card feedback-img-card" style={{ padding: 0, minHeight: '350px' }}>
              <div className="img-zoom-wrapper"><img src={`https://i.ibb.co/${img}`} className="clickable-img" onClick={(e) => openLightbox(e.target.src)} /></div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Bảng giá */}
      <section id="pricing" className="container section-padding">
        <div className="section-header"><h2>Bảng giá dịch vụ.</h2><p>Bảng giá công khai, minh bạch. Không phát sinh chi phí.</p></div>
        <div className="bento-grid">
          <div className="bento-card price-card">
            <h3>Uốn & Nối Mi</h3>
            <p className="text-small">Thiết kế dáng mi / Uốn mi phủ Collagen</p>
            <div style={{ margin: '8px 0 16px 0', fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--primary-dark)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px dashed var(--border-color)', paddingBottom: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: 'var(--fs-body)', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-dark)' }}>Uốn mi</span>
                <span style={{ fontSize: 'var(--fs-h3)' }}>149k</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 'var(--fs-body)', fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--text-dark)' }}>Nối mi thiết kế</span>
                <span style={{ fontSize: 'var(--fs-h3)' }}>249k</span>
              </div>
            </div>
            <ul className="check-list" style={{ marginBottom: '24px', flexGrow: 1 }}>
              <li><i className="ph-light ph-check"></i><span className="text-small">Tư vấn dáng mi phù hợp</span></li>
              <li><i className="ph-light ph-check"></i><span className="text-small">Sử dụng mi lụa, thuốc uốn cao cấp</span></li>
              <li><i className="ph-light ph-check"></i><span className="text-small">Keo chính hãng không cay</span></li>
              <li><i className="ph-light ph-check"></i><span className="text-small">Dặm mi trong vòng 3 ngày</span></li>
            </ul>
            <a href="#booking" className="btn btn-ghost" style={{ width: '100%' }}>Chọn dịch vụ</a>
          </div>

          <div className="bento-card bg-primary price-card scale-up">
            <div className="label-pill" style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '10px', padding: '4px 12px' }}>BEST SELLER</div>
            <h3>Combo Mày + Môi</h3>
            <p className="text-small text-light">Điêu khắc Hairstroke & Phun môi Nano</p>
            <div className="price-tag">3.500k</div>
            <ul className="check-list" style={{ marginBottom: '24px', flexGrow: 1 }}>
              <li><i className="ph-light ph-check" style={{ color: 'white' }}></i><span className="text-small text-light">Tiết kiệm 500k so với làm lẻ</span></li>
              <li><i className="ph-light ph-check" style={{ color: 'white' }}></i><span className="text-small text-light">Thiết kế dáng phong thủy</span></li>
              <li><i className="ph-light ph-check" style={{ color: 'white' }}></i><span className="text-small text-light">Khử thâm môi miễn phí</span></li>
              <li><i className="ph-light ph-check" style={{ color: 'white' }}></i><span className="text-small text-light">Bảo hành dặm lại 3 tháng</span></li>
              <li><i className="ph-light ph-check" style={{ color: 'white' }}></i><span className="text-small text-light">Tặng tuýp dưỡng chuyên dụng</span></li>
            </ul>
            <a href="#booking" className="btn" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--primary)', width: '100%' }}>Đặt Combo Ngay</a>
          </div>

          <div className="bento-card price-card">
            <h3>Xóa Sửa Mày Cũ</h3>
            <p className="text-small">Xử lý trổ xanh, đỏ, hút dung dịch</p>
            <div className="price-tag">Từ 500k</div>
            <ul className="check-list" style={{ marginBottom: '24px', flexGrow: 1 }}>
              <li><i className="ph-light ph-check"></i><span className="text-small">Phác đồ xử lý cá nhân hóa</span></li>
              <li><i className="ph-light ph-check"></i><span className="text-small">Hút màu không tổn thương da</span></li>
              <li><i className="ph-light ph-check"></i><span className="text-small">An toàn, không để lại sẹo</span></li>
            </ul>
            <a href="https://www.facebook.com/PhuongPhunXamThamMy/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ width: '100%' }}>Nhận tư vấn</a>
          </div>
        </div>
      </section>

      {/* 12. Booking CTA */}
      <section id="booking" className="container section-padding" style={{ marginTop: '80px', marginBottom: '120px' }}>
        <div className="bento-grid">
          <div className="bento-card book-1 bg-dark" style={{ justifyContent: 'center' }}>
            <h2 style={{ color: 'var(--text-light)', marginBottom: '16px' }}>Giữ chỗ ngay hôm nay để nhận ưu đãi 20%</h2>
            <p style={{ color: 'var(--text-light)', opacity: 0.8, marginBottom: '32px' }}>Gọi trực tiếp cho chúng tôi qua Hotline để đặt lịch nhanh chóng và nhận ngay ưu đãi dành riêng cho bạn.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ph-light ph-phone" style={{ fontSize: '28px', color: 'var(--text-light)' }}></i>
              </div>
              <div>
                <p className="text-small" style={{ color: 'var(--text-light)', margin: 0, opacity: 0.8 }}>Hotline tư vấn (Gọi ngay)</p>
                <h3 style={{ color: 'var(--text-light)', margin: 0 }}><a href="tel:0939732506" style={{ color: 'inherit' }}>093.973.2506</a></h3>
              </div>
            </div>
          </div>
          <div className="bento-card book-2" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '40px 24px' }}>
            <i className="ph-light ph-chat-circle-dots" style={{ fontSize: '56px', color: 'var(--primary)', marginBottom: '16px' }}></i>
            <h3 style={{ marginBottom: '16px' }}>Cần tư vấn trực tiếp?</h3>
            <p style={{ marginBottom: '32px', color: 'var(--text-muted)', maxWidth: '80%' }}>Kết nối ngay với chuyên gia Phương qua Fanpage để được tư vấn dáng mày, màu môi hay kiểu mi phù hợp nhất với khuôn mặt của bạn nhé!</p>
            <a href="https://m.me/PhuongPhunXamThamMy" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', maxWidth: '320px' }}>
              Chat với Phương ngay <i className="ph-light ph-paper-plane-tilt"></i>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}