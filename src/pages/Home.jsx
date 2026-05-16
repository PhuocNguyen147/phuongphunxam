import { useEffect, useRef, useState } from 'react';
import { api, resolveMediaUrl } from '../api';

const fallbackContent = {
  brand: {
    phone: '093.973.2506',
    phoneRaw: '0939732506',
    messenger: 'https://m.me/PhuongPhunXamThamMy',
  },
  hero: {
    badge: 'Ưu đãi 20% cho khách hàng mới',
    title: 'Đánh thức vẻ đẹp tự nhiên của bạn.',
    description: 'Nghệ thuật phun xăm phong thủy và nối mi thiết kế tinh tế.',
  },
  services: [],
  gallerySections: [],
  showcaseSections: [],
  serviceShowcase: null,
  pricing: [],
  booking: {
    title: 'Giữ chỗ ngay hôm nay để nhận ưu đãi 20%',
    description: 'Gửi thông tin đặt lịch, Phương Beauty sẽ liên hệ xác nhận trong thời gian sớm nhất.',
    services: ['Tư vấn phun xăm', 'Phun môi Nano', 'Nối mi thiết kế'],
  },
};

function getGallerySections(site) {
  if (Array.isArray(site.gallerySections) && site.gallerySections.length) {
    return site.gallerySections;
  }

  return [
    {
      id: 'gallery',
      label: 'Hình ảnh khách hàng',
      description: 'Thêm ảnh mới trong trang admin, ảnh sẽ tự xuất hiện tại đây.',
      images: site.gallery || [],
    },
  ];
}

function GalleryRail({ section, openLightbox, showHeader = true }) {
  const images = section.images || [];
  const repeatedImages = images.length > 1 ? [...images, ...images] : images;
  const railRef = useRef(null);
  const dragRef = useRef({
    dragged: false,
    dragging: false,
    paused: false,
    pointerId: null,
    startScroll: 0,
    startX: 0,
    velocity: 0,
  });
  const resumeTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(resumeTimerRef.current), []);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || images.length < 2) return undefined;

    let frame = 0;
    let lastTime = performance.now();

    const tick = (time) => {
      const state = dragRef.current;
      const distance = time - lastTime;
      const resetAt = rail.scrollWidth / 2;
      const shouldMove = !state.paused && !state.dragging && resetAt > rail.clientWidth;
      const targetVelocity = shouldMove ? 0.01 : 0;

      state.velocity += (targetVelocity - state.velocity) * 0.08;

      if (state.velocity > 0.0001) {
        rail.scrollLeft += distance * state.velocity;
        if (rail.scrollLeft >= resetAt) {
          rail.scrollLeft -= resetAt;
        }
      } else if (!shouldMove) {
        state.velocity = 0;
      }

      lastTime = time;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [images.length]);

  const pause = () => {
    window.clearTimeout(resumeTimerRef.current);
    dragRef.current.paused = true;
  };

  const resumeSoon = () => {
    window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      dragRef.current.paused = false;
    }, 1200);
  };

  const startDrag = (event) => {
    const rail = railRef.current;
    if (!rail) return;

    pause();
    if (event.pointerType === 'touch') {
      dragRef.current = {
        ...dragRef.current,
        dragged: false,
        dragging: false,
        pointerId: event.pointerId,
        startScroll: rail.scrollLeft,
        startX: event.clientX,
      };
      return;
    }

    dragRef.current = {
      ...dragRef.current,
      dragged: false,
      dragging: true,
      pointerId: event.pointerId,
      startScroll: rail.scrollLeft,
      startX: event.clientX,
    };
    rail.setPointerCapture?.(event.pointerId);
  };

  const drag = (event) => {
    const rail = railRef.current;
    const state = dragRef.current;
    if (!rail || state.pointerId !== event.pointerId) return;

    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 4) state.dragged = true;
    if (!state.dragging) return;
    rail.scrollLeft = state.startScroll - delta;
  };

  const stopDrag = (event) => {
    const rail = railRef.current;
    if (rail && dragRef.current.pointerId === event.pointerId) {
      rail.releasePointerCapture?.(event.pointerId);
    }

    dragRef.current.dragging = false;
    dragRef.current.pointerId = null;
    window.setTimeout(() => {
      dragRef.current.dragged = false;
    }, 120);
    resumeSoon();
  };

  if (!images.length) return null;

  return (
    <section className="gallery-category" aria-label={section.label}>
      {showHeader && (
        <div className="gallery-category-header">
          <div>
            <span className="text-small">{section.id}</span>
            <h3>{section.label}</h3>
          </div>
          <p>{section.description}</p>
        </div>
      )}

      <div
        className="gallery-rail"
        ref={railRef}
        onMouseEnter={pause}
        onMouseLeave={resumeSoon}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
      >
        <div className={`gallery-track ${images.length < 2 ? 'is-static' : ''}`}>
          {repeatedImages.map((image, index) => {
            const imageUrl = resolveMediaUrl(image.url);
            return (
              <button
                className="gallery-slide"
                type="button"
                key={`${image.url}-${index}`}
                onClick={(event) => {
                  if (dragRef.current.dragged) {
                    event.preventDefault();
                    return;
                  }
                  openLightbox(imageUrl);
                }}
              >
                <img src={imageUrl} alt={image.title || section.label} loading="lazy" />
                {image.title && <span>{image.title}</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ServiceShowcase({ showcase, openLightbox }) {
  if (!showcase) return null;

  const beforeUrl = resolveMediaUrl(showcase.beforeImage?.url);
  const afterUrl = resolveMediaUrl(showcase.afterImage?.url);

  return (
    <section id="services" className="container">
      <div className="service-showcase-grid">
        <div className="bento-card service-showcase-main">
          <h2>{showcase.title}</h2>
          <p>{showcase.description}</p>
          <div className="before-after-grid">
            {[{ label: showcase.beforeLabel, image: showcase.beforeImage, url: beforeUrl }, { label: showcase.afterLabel, image: showcase.afterImage, url: afterUrl }].map((item) => (
              <button className="before-after-card" type="button" key={item.label} onClick={() => item.url && openLightbox(item.url)}>
                <span>{item.label}</span>
                {item.url && <img src={item.url} alt={item.image?.title || item.label} loading="lazy" />}
              </button>
            ))}
          </div>
        </div>

        {(showcase.cards || []).map((card) => (
          <div className={`bento-card service-side-card ${card.tone === 'primary' ? 'bg-primary' : ''}`} key={card.title}>
            {card.icon && <i className={`ph-light ${card.icon} card-icon`}></i>}
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </div>
        ))}

        {(showcase.stats || []).map((stat) => (
          <div className="bento-card service-stat-card text-center" key={stat.label}>
            <h2>{stat.value}</h2>
            <p className="text-small">{stat.label}</p>
          </div>
        ))}

        {showcase.quote?.text && (
          <div className="bento-card service-quote-card bg-dark">
            <h3>"{showcase.quote.text}"</h3>
            <div className="avatar-group">
              {showcase.quote.avatar && <img src={resolveMediaUrl(showcase.quote.avatar)} alt={showcase.quote.author} className="avatar" />}
              <div>
                <p style={{ margin: 0, color: 'var(--text-light)', fontWeight: 700 }}>{showcase.quote.author}</p>
                <p className="text-small" style={{ margin: 0 }}>{showcase.quote.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ShowcaseSection({ section, openLightbox }) {
  if (!section?.images?.length) return null;

  if (section.layout === 'rail') {
    return (
      <section className="homepage-showcase section-padding">
        <div className="container section-header">
          <h2>{section.title}</h2>
          <p>{section.description}</p>
        </div>
        <GalleryRail section={{ ...section, label: section.title }} openLightbox={openLightbox} showHeader={false} />
      </section>
    );
  }

  return (
    <section className="homepage-showcase container section-padding">
      <div className="section-header">
        <h2>{section.title}</h2>
        <p>{section.description}</p>
      </div>
      <div className="showcase-image-grid">
        {section.images.map((image, index) => {
          const imageUrl = resolveMediaUrl(image.url);
          return (
            <button className="showcase-image-card" type="button" key={`${image.url}-${index}`} onClick={() => openLightbox(imageUrl)}>
              <img src={imageUrl} alt={image.title || section.title} loading="lazy" />
              {image.title && <span>{image.title}</span>}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function Home({ content, openLightbox }) {
  const site = content || fallbackContent;
  const gallerySections = getGallerySections(site);
  const [booking, setBooking] = useState({
    name: '',
    phone: '',
    service: site.booking.services[0] || '',
    date: '',
    time: '',
    note: '',
  });
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateBooking = (field, value) => {
    setBooking((current) => ({ ...current, [field]: value }));
  };

  const updatePhone = (value) => {
    updateBooking('phone', value.replace(/\D/g, '').slice(0, 11));
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      await api.createBooking(booking);
      setStatus('Đã nhận lịch hẹn. Phương Beauty sẽ liên hệ xác nhận sớm nhé.');
      setBooking({
        name: '',
        phone: '',
        service: site.booking.services[0] || '',
        date: '',
        time: '',
        note: '',
      });
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="section-gap">
      <section className="hero container section-padding">
        <div className="label-pill">
          <div className="dot-pulse"></div>
          {site.hero.badge}
        </div>
        <h1 className="display-text text-balance">{site.hero.title}</h1>
        <p className="text-balance" style={{ maxWidth: '600px', fontSize: '1.125rem' }}>{site.hero.description}</p>
        <div className="hero-actions">
          <a href="#booking" className="btn btn-primary">Đặt lịch ngay <i className="ph-light ph-arrow-right"></i></a>
          <a href="#pricing" className="btn btn-ghost">Xem bảng giá</a>
        </div>
      </section>

      <ServiceShowcase showcase={site.serviceShowcase} openLightbox={openLightbox} />

      <section id="gallery" className="gallery-area section-padding">
        <div className="container section-header">
          <h2>Thư viện hình ảnh theo dịch vụ</h2>
          <p>Ảnh làm môi, làm mi và làm mày được tách riêng để khách xem nhanh hơn trên điện thoại.</p>
        </div>
        {gallerySections.map((section) => (
          <GalleryRail key={section.id} section={section} openLightbox={openLightbox} />
        ))}
      </section>

      {(site.showcaseSections || []).map((section) => (
        <ShowcaseSection section={section} openLightbox={openLightbox} key={section.id} />
      ))}

      <section id="pricing" className="container section-padding">
        <div className="section-header">
          <h2>Bảng giá dịch vụ</h2>
          <p>Bảng giá có thể cập nhật trực tiếp trong trang admin.</p>
        </div>
        <div className="bento-grid">
          {(site.pricing || []).map((item) => (
            <div key={item.name} className={`bento-card price-card ${item.featured ? 'bg-primary scale-up' : ''}`}>
              {item.featured && <div className="label-pill" style={{ alignSelf: 'flex-start', fontSize: '10px', padding: '4px 12px' }}>BEST SELLER</div>}
              <h3>{item.name}</h3>
              <p className={item.featured ? 'text-small text-light' : 'text-small'}>{item.description}</p>
              <div className="price-tag">{item.price}</div>
              <a href="#booking" className={item.featured ? 'btn' : 'btn btn-ghost'} style={item.featured ? { backgroundColor: 'var(--card-bg)', color: 'var(--primary)' } : {}}>
                Chọn dịch vụ
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="booking" className="container section-padding booking-section">
        <div className="bento-grid">
          <div className="bento-card book-1 bg-dark" style={{ justifyContent: 'center' }}>
            <h2 style={{ color: 'var(--text-light)', marginBottom: '16px' }}>{site.booking.title}</h2>
            <p style={{ color: 'var(--text-light)', opacity: 0.8, marginBottom: '32px' }}>{site.booking.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="ph-light ph-phone" style={{ fontSize: '28px', color: 'var(--text-light)' }}></i>
              </div>
              <div>
                <p className="text-small" style={{ color: 'var(--text-light)', margin: 0, opacity: 0.8 }}>Hotline tư vấn</p>
                <h3 style={{ color: 'var(--text-light)', margin: 0 }}><a href={`tel:${site.brand.phoneRaw}`}>{site.brand.phone}</a></h3>
              </div>
            </div>
          </div>
          <div className="bento-card book-2">
            <form className="booking-form" onSubmit={submitBooking}>
              <input className="input-field" value={booking.name} onChange={(event) => updateBooking('name', event.target.value)} placeholder="Họ và tên" required />
              <input
                className="input-field"
                value={booking.phone}
                onChange={(event) => updatePhone(event.target.value)}
                placeholder="Số điện thoại"
                inputMode="numeric"
                pattern="[0-9]{9,11}"
                minLength="9"
                maxLength="11"
                required
              />
              <select className="input-field" value={booking.service} onChange={(event) => updateBooking('service', event.target.value)} required>
                {(site.booking.services || []).map((service) => <option key={service}>{service}</option>)}
              </select>
              <div className="form-row">
                <input className="input-field" type="date" value={booking.date} onChange={(event) => updateBooking('date', event.target.value)} required />
                <input className="input-field" type="time" value={booking.time} onChange={(event) => updateBooking('time', event.target.value)} required />
              </div>
              <textarea className="input-field" value={booking.note} onChange={(event) => updateBooking('note', event.target.value)} placeholder="Ghi chú thêm" rows="4" />
              <button className="btn btn-primary" disabled={isSubmitting} type="submit">
                {isSubmitting ? 'Đang gửi...' : 'Gửi lịch hẹn'}
              </button>
              {status && <p className="form-status">{status}</p>}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
