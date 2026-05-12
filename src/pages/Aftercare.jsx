export default function Aftercare() {
  return (
    <main className="section-gap" style={{ marginBottom: '60px' }}>
      <section className="container" style={{ paddingTop: '64px', textAlign: 'center' }}>
        <div className="label-pill" style={{ marginBottom: '24px' }}>
          <i className="ph-light ph-book-open"></i> Cẩm Nang Hậu Phẫu
        </div>
        <h1 className="display-text text-balance">Hướng Dẫn Chăm Sóc Đúng Cách</h1>
        <p className="text-balance" style={{ maxWidth: '700px', margin: '16px auto 0' }}>Để có một kết quả hoàn mỹ, 50% phụ thuộc vào tay nghề chuyên gia, 50% còn lại phụ thuộc vào cách bạn chăm sóc tại nhà. Hãy làm theo các bước dưới đây nhé!</p>
      </section>

      {/* Chăm sóc Mày */}
      <section className="container">
        <div className="section-header" style={{ alignItems: 'flex-start', textAlign: 'left', marginBottom: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ph-light ph-pen-nib" style={{ color: 'var(--primary)' }}></i> Chăm sóc Chân Mày
          </h2>
        </div>
        <div className="bento-grid">
          <div className="bento-card care-main">
            <h3>Quy trình hồi phục & bong vảy</h3>
            <p style={{ marginBottom: '16px' }}>Tuyệt đối để vảy bong tự nhiên, không dùng tay cạy hay bóc vảy để tránh làm mất màu sợi hoặc gây sẹo.</p>
            <ul className="check-list" style={{ gap: '20px' }}>
              <li>
                <div className="step-number">1</div>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Ngày 1 - Ngày 3:</strong>
                  <p className="text-small">Mày có màu đậm, sắc nét hơn bình thường. Vùng da có thể hơi căng nhẹ (rất bình thường). Dùng bông tẩy trang ẩm thấm nhẹ nước mô (nếu có).</p>
                </div>
              </li>
              <li>
                <div className="step-number">2</div>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Ngày 4 - Ngày 7:</strong>
                  <p className="text-small">Mày bắt đầu bong vảy mỏng. Cảm giác hơi ngứa nhẹ. Hãy bôi lớp dưỡng mỏng (theo chỉ định của chuyên gia) để làm mềm vảy.</p>
                </div>
              </li>
              <li>
                <div className="step-number">3</div>
                <div>
                  <strong style={{ color: 'var(--text-dark)' }}>Sau 1 tháng:</strong>
                  <p className="text-small">Màu mày đã ổn định và tệp vào da trông cực kỳ tự nhiên. Nếu có chỗ nhạt màu, bạn có thể quay lại dặm miễn phí.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bento-card care-side bg-warning-soft">
            <i className="ph-light ph-warning-circle card-icon"></i>
            <h3>Những điều CẦN TRÁNH</h3>
            <ul className="check-list">
              <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Kiêng nước:</strong> Tránh để nước sinh hoạt dính trực tiếp vào vùng mày trong 3-5 ngày đầu.</span></li>
              <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Không cạy bóc:</strong> Để vảy bong tự nhiên. Tuyệt đối không dùng tay cạy, gãi ngứa tránh gây sẹo sần.</span></li>
              <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Tránh mỹ phẩm:</strong> Không trang điểm, không kẻ chân mày đè lên khi chưa bong hết.</span></li>
              <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Kiêng ăn uống:</strong> Tránh đồ nếp, thịt bò, gà, hải sản, rau muống trong 2 tuần để không sưng đỏ, viêm mủ.</span></li>
              <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Sinh hoạt:</strong> Hạn chế nằm sấp khi ngủ. Tránh ánh nắng gắt, đi bơi, xông hơi.</span></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Chăm sóc Môi */}
      <section className="container" style={{ marginTop: '24px' }}>
        <div className="section-header" style={{ alignItems: 'flex-start', textAlign: 'left', marginBottom: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="ph-light ph-lips" style={{ color: 'var(--primary)' }}></i> Chăm sóc Môi Nano
          </h2>
        </div>
        <div className="bento-grid">
          <div className="bento-card care-half bg-primary">
            <i className="ph-light ph-drop card-icon" style={{ color: 'white' }}></i>
            <h3 style={{ color: 'white' }}>Vệ sinh & Dưỡng NÊN LÀM</h3>
            <p style={{ color: 'white', opacity: 0.9, marginBottom: '16px' }}>Bí quyết để môi nhanh liền, lên màu chuẩn, mướt mát và căng mọng.</p>
            <ul className="check-list">
              <li><i className="ph-light ph-check-circle" style={{ color: 'white' }}></i><span className="text-small text-light"><strong>Vệ sinh sau ăn:</strong> Dùng tăm bông thấm nước muối sinh lý lau nhẹ nhàng sạch đồ ăn thừa. Sau đó thấm khô bằng bông gòn.</span></li>
              <li><i className="ph-light ph-check-circle" style={{ color: 'white' }}></i><span className="text-small text-light"><strong>Dưỡng ẩm liên tục:</strong> Sau 24h, bắt đầu bôi tuýp dưỡng chuyên dụng để môi luôn mềm, không héo màu nứt nẻ.</span></li>
              <li><i className="ph-light ph-check-circle" style={{ color: 'white' }}></i><span className="text-small text-light"><strong>Dinh dưỡng:</strong> Uống nhiều nước (dùng ống hút). Tăng cường ăn dứa, cam, chanh, cà chua, sữa chua để vitamin C giúp màu lên tươi hơn.</span></li>
            </ul>
          </div>

          <div className="bento-card care-half bg-warning-soft">
            <i className="ph-light ph-warning-octagon card-icon"></i>
            <h3>Những điều CẦN TRÁNH</h3>
            <p style={{ marginBottom: '16px' }}>Những lưu ý vàng giúp môi không sưng, không loang lổ và lên màu trong trẻo nhất.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              <ul className="check-list">
                <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Đồ ăn gây sẹo/sưng:</strong> Tuyệt đối kiêng thịt bò, gà, hải sản, đồ nếp, rau muống ít nhất 2 tuần.</span></li>
                <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Đồ uống đậm màu, chất kích thích:</strong> Tránh nước tương, cà phê, trà đặc, rượu bia để môi không bị xỉn thâm. Tránh đồ cay nóng (tiêu, ớt).</span></li>
                <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Kiêng cọ xát & nước:</strong> Dùng ống hút khi uống nước. Tuyệt đối không liếm môi, cắn môi, không tự ý bóc mài hay có các tiếp xúc mạnh (như hôn).</span></li>
                <li><i className="ph-light ph-x" style={{ color: '#ff6b6b' }}></i><span className="text-small"><strong>Kiêng đánh răng:</strong> Tránh dùng kem đánh răng trong 3-5 ngày đầu (bạn nên thay thế bằng cách súc miệng nước muối sinh lý).</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Hỗ trợ */}
      <section className="container" style={{ marginTop: '40px' }}>
        <div className="bento-card" style={{ alignItems: 'center', textAlign: 'center', justifyContent: 'center', padding: '48px 24px', background: 'linear-gradient(135deg, #FAF7F2 0%, #F0EAE1 100%)' }}>
          <i className="ph-light ph-headset" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '16px' }}></i>
          <h3 style={{ marginBottom: '16px' }}>Bạn có thắc mắc trong quá trình chăm sóc?</h3>
          <p style={{ maxWidth: '600px', marginBottom: '24px' }}>Đừng ngần ngại liên hệ ngay với chúng tôi. Chuyên gia Phương luôn sẵn sàng hỗ trợ và giải đáp mọi lo lắng của bạn 24/7.</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:0939732506" className="btn btn-primary">Gọi Hotline 093.973.2506</a>
            <a href="https://m.me/PhuongPhunXamThamMy" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Chat Messenger</a>
          </div>
        </div>
      </section>
    </main>
  );
}
