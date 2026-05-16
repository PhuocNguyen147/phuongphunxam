const fallbackAftercare = {
  badge: 'Cẩm nang hậu phẫu',
  title: 'Hướng dẫn chăm sóc đúng cách',
  description: 'Các hướng dẫn chăm sóc sau khi làm dịch vụ.',
  sections: [],
  cta: {
    title: 'Bạn có thắc mắc trong quá trình chăm sóc?',
    description: 'Liên hệ Phuong Beauty để được hỗ trợ.',
    primaryText: 'Gọi Hotline',
    secondaryText: 'Chat Messenger',
  },
};

function getCardClass(tone) {
  if (tone === 'primary') return 'bento-card care-half bg-primary';
  if (tone === 'warning') return 'bento-card care-half bg-warning-soft';
  return 'bento-card care-half';
}

function CareCard({ card, index }) {
  const isPrimary = card.tone === 'primary';
  const iconColor = isPrimary ? 'white' : undefined;

  return (
    <div className={getCardClass(card.tone)}>
      {card.icon && <i className={`ph-light ${card.icon} card-icon`} style={iconColor ? { color: iconColor } : {}}></i>}
      <h3 style={isPrimary ? { color: 'white' } : {}}>{card.title}</h3>
      {card.description && <p style={isPrimary ? { color: 'white', opacity: 0.9, marginBottom: '16px' } : { marginBottom: '16px' }}>{card.description}</p>}
      <ul className="check-list" style={{ gap: '16px' }}>
        {(card.items || []).map((item, itemIndex) => (
          <li key={`${item}-${itemIndex}`}>
            {card.tone === 'default' ? (
              <div className="step-number">{itemIndex + 1}</div>
            ) : (
              <i
                className={`ph-light ${card.tone === 'warning' ? 'ph-x' : 'ph-check-circle'}`}
                style={{ color: card.tone === 'warning' ? '#ff6b6b' : iconColor }}
              ></i>
            )}
            <span className={isPrimary ? 'text-small text-light' : 'text-small'}>{item}</span>
          </li>
        ))}
      </ul>
      {index === 0 && card.tone === 'default' && <span className="sr-only">Quy trình từng bước</span>}
    </div>
  );
}

export default function Aftercare({ content }) {
  const aftercare = content?.aftercare || fallbackAftercare;
  const brand = content?.brand || {
    phone: '093.973.2506',
    phoneRaw: '0939732506',
    messenger: 'https://m.me/PhuongPhunXamThamMy',
  };

  return (
    <main className="section-gap" style={{ marginBottom: '60px' }}>
      <section className="container" style={{ paddingTop: '64px', textAlign: 'center' }}>
        <div className="label-pill" style={{ marginBottom: '24px' }}>
          <i className="ph-light ph-book-open"></i> {aftercare.badge}
        </div>
        <h1 className="display-text text-balance">{aftercare.title}</h1>
        <p className="text-balance" style={{ maxWidth: '700px', margin: '16px auto 0' }}>{aftercare.description}</p>
      </section>

      {(aftercare.sections || []).map((section) => (
        <section className="container" style={{ marginTop: '24px' }} key={section.id || section.title}>
          <div className="section-header" style={{ alignItems: 'flex-start', textAlign: 'left', marginBottom: '24px' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {section.icon && <i className={`ph-light ${section.icon}`} style={{ color: 'var(--primary)' }}></i>} {section.title}
            </h2>
          </div>
          <div className="bento-grid">
            {(section.cards || []).map((card, index) => (
              <CareCard card={card} index={index} key={`${section.id}-${card.title}-${index}`} />
            ))}
          </div>
        </section>
      ))}

      <section className="container" style={{ marginTop: '40px' }}>
        <div className="bento-card aftercare-cta">
          <i className="ph-light ph-headset" style={{ fontSize: '48px', color: 'var(--primary)', marginBottom: '16px' }}></i>
          <h3 style={{ marginBottom: '16px' }}>{aftercare.cta?.title}</h3>
          <p style={{ maxWidth: '600px', marginBottom: '24px' }}>{aftercare.cta?.description}</p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href={`tel:${brand.phoneRaw}`} className="btn btn-primary">{aftercare.cta?.primaryText || brand.phone}</a>
            <a href={brand.messenger} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">{aftercare.cta?.secondaryText || 'Chat Messenger'}</a>
          </div>
        </div>
      </section>
    </main>
  );
}
