import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '../api';

const emptyService = { title: '', description: '', icon: 'ph-sparkle' };
const emptyImage = { title: '', url: '' };
const emptyPrice = { name: '', price: '', description: '', featured: false };
const emptyShowcaseCard = { title: '', description: '', icon: 'ph-sparkle', tone: 'default' };
const emptyShowcaseStat = { value: '', label: '' };
const emptyShowcaseSection = { id: 'showcase', title: 'Khu nội dung mới', description: '', layout: 'grid', images: [] };
const emptyCareSection = { id: 'section', title: 'Nhóm chăm sóc mới', icon: 'ph-sparkle', cards: [] };
const emptyCareCard = { title: 'Hướng dẫn mới', icon: 'ph-check-circle', tone: 'default', description: '', items: [''] };
const defaultGallerySections = [
  { id: 'lips', label: 'Ảnh làm môi', description: '', images: [] },
  { id: 'lashes', label: 'Ảnh làm mi', description: '', images: [] },
  { id: 'brows', label: 'Ảnh làm mày', description: '', images: [] },
];
const defaultAftercare = {
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
const defaultServiceShowcase = {
  title: 'Nghệ thuật Phun Xăm Tự Nhiên',
  description: '',
  beforeLabel: 'Trước',
  afterLabel: 'Sau',
  beforeImage: { title: '', url: '' },
  afterImage: { title: '', url: '' },
  cards: [],
  stats: [],
  quote: { text: '', author: '', role: '', avatar: '' },
};
const bookingTabs = [
  { id: 'new', label: 'Khách mới' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'rescheduled', label: 'Hẹn lại' },
  { id: 'done', label: 'Hoàn thành' },
  { id: 'cancelled', label: 'Đã hủy' },
];

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function normalizeDraft(content) {
  if (!content) return null;
  const next = structuredClone(content);

  if (!Array.isArray(next.gallerySections)) {
    next.gallerySections = defaultGallerySections.map((section) => ({ ...section, images: content.gallery || [] }));
  }

  if (!next.aftercare) {
    next.aftercare = structuredClone(defaultAftercare);
  }

  if (!next.serviceShowcase) {
    next.serviceShowcase = structuredClone(defaultServiceShowcase);
  }
  next.serviceShowcase.beforeImage = next.serviceShowcase.beforeImage || { title: '', url: '' };
  next.serviceShowcase.afterImage = next.serviceShowcase.afterImage || { title: '', url: '' };
  next.serviceShowcase.quote = next.serviceShowcase.quote || { text: '', author: '', role: '', avatar: '' };
  next.serviceShowcase.cards = Array.isArray(next.serviceShowcase.cards) ? next.serviceShowcase.cards : [];
  next.serviceShowcase.stats = Array.isArray(next.serviceShowcase.stats) ? next.serviceShowcase.stats : [];

  if (!Array.isArray(next.showcaseSections)) {
    next.showcaseSections = [];
  }
  next.showcaseSections = next.showcaseSections.map((section) => ({
    ...emptyShowcaseSection,
    ...section,
    images: Array.isArray(section.images) ? section.images : [],
  }));

  return next;
}

export default function Admin({ initialContent, setContent }) {
  const [draft, setDraft] = useState(() => normalizeDraft(initialContent));
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('content');
  const [bookingView, setBookingView] = useState('new');
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(api.getAdminToken()));
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;

    let isActive = true;
    api.getBookings()
      .then((items) => {
        if (isActive) setBookings(items);
      })
      .catch((error) => {
        if (!isActive) return;
        api.clearAdminToken();
        setIsAuthenticated(false);
        setStatus(error.message);
      });

    return () => {
      isActive = false;
    };
  }, [isAuthenticated]);

  if (!draft) {
    return (
      <main className="admin-shell">
        <div className="admin-topbar">
          <h1>Admin Phuong Beauty</h1>
        </div>
        <p>Đang tải dữ liệu quản trị...</p>
      </main>
    );
  }

  const handleAuthError = (error) => {
    if (error.message.includes('đăng nhập') || error.message.includes('admin')) {
      api.clearAdminToken();
      setIsAuthenticated(false);
    }
    setStatus(error.message);
  };

  const login = async (event) => {
    event.preventDefault();
    setLoginError('');

    try {
      await api.login(password);
      setPassword('');
      setIsAuthenticated(true);
      setStatus('Đăng nhập admin thành công.');
    } catch (error) {
      setLoginError(error.message);
    }
  };

  const logout = () => {
    api.clearAdminToken();
    setIsAuthenticated(false);
    setStatus('Đã đăng xuất admin.');
  };

  const updatePath = (path, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      let target = next;
      path.slice(0, -1).forEach((key) => {
        target = target[key];
      });
      target[path[path.length - 1]] = value;
      return next;
    });
  };

  const updateListItem = (listName, index, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next[listName][index][field] = value;
      return next;
    });
  };

  const addListItem = (listName, item) => {
    setDraft((current) => ({ ...current, [listName]: [...current[listName], item] }));
  };

  const removeListItem = (listName, index) => {
    setDraft((current) => ({
      ...current,
      [listName]: current[listName].filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const updateGallerySection = (sectionIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.gallerySections[sectionIndex][field] = value;
      return next;
    });
  };

  const updateGalleryImage = (sectionIndex, imageIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.gallerySections[sectionIndex].images[imageIndex][field] = value;
      return next;
    });
  };

  const addGalleryImage = (sectionIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.gallerySections[sectionIndex].images.push(emptyImage);
      return next;
    });
  };

  const removeGalleryImage = (sectionIndex, imageIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.gallerySections[sectionIndex].images = next.gallerySections[sectionIndex].images.filter((_, index) => index !== imageIndex);
      return next;
    });
  };

  const addServiceShowcaseCard = () => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.serviceShowcase.cards.push(structuredClone(emptyShowcaseCard));
      return next;
    });
  };

  const updateServiceShowcaseCard = (cardIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.serviceShowcase.cards[cardIndex][field] = value;
      return next;
    });
  };

  const removeServiceShowcaseCard = (cardIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.serviceShowcase.cards = next.serviceShowcase.cards.filter((_, index) => index !== cardIndex);
      return next;
    });
  };

  const addServiceShowcaseStat = () => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.serviceShowcase.stats.push(structuredClone(emptyShowcaseStat));
      return next;
    });
  };

  const updateServiceShowcaseStat = (statIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.serviceShowcase.stats[statIndex][field] = value;
      return next;
    });
  };

  const removeServiceShowcaseStat = (statIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.serviceShowcase.stats = next.serviceShowcase.stats.filter((_, index) => index !== statIndex);
      return next;
    });
  };

  const addShowcaseSection = () => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.showcaseSections.push({
        ...structuredClone(emptyShowcaseSection),
        id: `showcase-${Date.now()}`,
      });
      return next;
    });
  };

  const updateShowcaseSection = (sectionIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.showcaseSections[sectionIndex][field] = value;
      return next;
    });
  };

  const removeShowcaseSection = (sectionIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.showcaseSections = next.showcaseSections.filter((_, index) => index !== sectionIndex);
      return next;
    });
  };

  const addShowcaseImage = (sectionIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.showcaseSections[sectionIndex].images.push(structuredClone(emptyImage));
      return next;
    });
  };

  const updateShowcaseImage = (sectionIndex, imageIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.showcaseSections[sectionIndex].images[imageIndex][field] = value;
      return next;
    });
  };

  const removeShowcaseImage = (sectionIndex, imageIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.showcaseSections[sectionIndex].images = next.showcaseSections[sectionIndex].images.filter((_, index) => index !== imageIndex);
      return next;
    });
  };

  const addCareSection = () => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections.push({ ...emptyCareSection, id: `care-${Date.now()}` });
      return next;
    });
  };

  const removeCareSection = (sectionIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections = next.aftercare.sections.filter((_, index) => index !== sectionIndex);
      return next;
    });
  };

  const updateCareSection = (sectionIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections[sectionIndex][field] = value;
      return next;
    });
  };

  const addCareCard = (sectionIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections[sectionIndex].cards.push(structuredClone(emptyCareCard));
      return next;
    });
  };

  const removeCareCard = (sectionIndex, cardIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections[sectionIndex].cards = next.aftercare.sections[sectionIndex].cards.filter((_, index) => index !== cardIndex);
      return next;
    });
  };

  const updateCareCard = (sectionIndex, cardIndex, field, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections[sectionIndex].cards[cardIndex][field] = value;
      return next;
    });
  };

  const addCareItem = (sectionIndex, cardIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections[sectionIndex].cards[cardIndex].items.push('');
      return next;
    });
  };

  const removeCareItem = (sectionIndex, cardIndex, itemIndex) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections[sectionIndex].cards[cardIndex].items = next.aftercare.sections[sectionIndex].cards[cardIndex].items.filter((_, index) => index !== itemIndex);
      return next;
    });
  };

  const updateCareItem = (sectionIndex, cardIndex, itemIndex, value) => {
    setDraft((current) => {
      const next = structuredClone(current);
      next.aftercare.sections[sectionIndex].cards[cardIndex].items[itemIndex] = value;
      return next;
    });
  };

  const uploadImageToPath = async (file, path) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setStatus('Đang tải ảnh lên...');
        const uploaded = await api.uploadImage({ name: file.name, dataUrl: reader.result });
        updatePath(path, uploaded.url);
        setStatus('Ảnh đã tải lên, bấm Lưu thay đổi để cập nhật website.');
      } catch (error) {
        handleAuthError(error);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file, sectionIndex, imageIndex) => {
    await uploadImageToPath(file, ['gallerySections', sectionIndex, 'images', imageIndex, 'url']);
  };

  const saveContent = async () => {
    try {
      setStatus('Đang lưu...');
      const saved = await api.saveContent(draft);
      setContent(saved);
      setStatus('Đã lưu nội dung website.');
    } catch (error) {
      handleAuthError(error);
    }
  };

  const updateBookingStatus = async (bookingId, value) => {
    try {
      const changes = { status: value };
      if (value === 'rescheduled') {
        const booking = bookings.find((item) => item.id === bookingId);
        changes.rescheduledDate = booking?.rescheduledDate || booking?.date || '';
        changes.rescheduledTime = booking?.rescheduledTime || booking?.time || '';
      }
      const updated = await api.updateBooking(bookingId, changes);
      setBookings((current) => current.map((booking) => booking.id === bookingId ? updated : booking));
    } catch (error) {
      handleAuthError(error);
    }
  };

  const updateBookingSchedule = async (bookingId, field, value) => {
    try {
      const updated = await api.updateBooking(bookingId, {
        status: 'rescheduled',
        [field]: value,
      });
      setBookings((current) => current.map((booking) => booking.id === bookingId ? updated : booking));
    } catch (error) {
      handleAuthError(error);
    }
  };

  const filteredBookings = bookings.filter((booking) => (booking.status || 'new') === bookingView);

  if (!isAuthenticated) {
    return (
      <main className="admin-login-shell">
        <form className="admin-login-card" onSubmit={login}>
          <div className="logo">
            <i className="ph-light ph-flower-lotus"></i>
            Phuong Beauty
          </div>
          <h1>Đăng nhập admin</h1>
          <p>Đăng nhập để sửa nội dung, tải ảnh và xem lịch hẹn.</p>
          <input
            className="input-field"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mật khẩu admin"
            required
          />
          <button className="btn btn-primary" type="submit">Đăng nhập</button>
          {loginError && <p className="form-status">{loginError}</p>}
          <a className="text-button" href="/">Quay lại website</a>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-topbar">
        <div>
          <p className="text-small">Quản trị website</p>
          <h1>Phuong Beauty Admin</h1>
        </div>
        <div className="admin-top-actions">
          <a className="btn btn-ghost" href="/">Xem website</a>
          <button className="btn btn-ghost" type="button" onClick={logout}>Đăng xuất</button>
        </div>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'content' ? 'active' : ''} onClick={() => setActiveTab('content')}>Nội dung</button>
        <button className={activeTab === 'images' ? 'active' : ''} onClick={() => setActiveTab('images')}>Hình ảnh</button>
        <button className={activeTab === 'aftercare' ? 'active' : ''} onClick={() => setActiveTab('aftercare')}>Chăm sóc</button>
        <button className={activeTab === 'bookings' ? 'active' : ''} onClick={() => setActiveTab('bookings')}>Lịch hẹn</button>
      </div>

      {status && <p className="admin-status">{status}</p>}

      {activeTab === 'content' && (
        <section className="admin-grid">
          <div className="admin-panel">
            <h2>Thông tin thương hiệu</h2>
            <Field label="Tên thương hiệu">
              <input value={draft.brand.name} onChange={(event) => updatePath(['brand', 'name'], event.target.value)} />
            </Field>
            <Field label="Mô tả footer">
              <textarea value={draft.brand.tagline} onChange={(event) => updatePath(['brand', 'tagline'], event.target.value)} rows="3" />
            </Field>
            <Field label="Số điện thoại hiển thị">
              <input value={draft.brand.phone} onChange={(event) => updatePath(['brand', 'phone'], event.target.value)} />
            </Field>
            <Field label="Số điện thoại gọi">
              <input value={draft.brand.phoneRaw} onChange={(event) => updatePath(['brand', 'phoneRaw'], event.target.value)} />
            </Field>
            <Field label="Facebook">
              <input value={draft.brand.facebook} onChange={(event) => updatePath(['brand', 'facebook'], event.target.value)} />
            </Field>
          </div>

          <div className="admin-panel">
            <h2>Hero</h2>
            <Field label="Nhãn ưu đãi">
              <input value={draft.hero.badge} onChange={(event) => updatePath(['hero', 'badge'], event.target.value)} />
            </Field>
            <Field label="Tiêu đề chính">
              <textarea value={draft.hero.title} onChange={(event) => updatePath(['hero', 'title'], event.target.value)} rows="2" />
            </Field>
            <Field label="Mô tả">
              <textarea value={draft.hero.description} onChange={(event) => updatePath(['hero', 'description'], event.target.value)} rows="4" />
            </Field>
          </div>

          <div className="admin-panel wide">
            <div className="admin-panel-heading">
              <h2>Khối dịch vụ nổi bật</h2>
              <div className="admin-mini-actions">
                <button className="btn btn-ghost" type="button" onClick={addServiceShowcaseCard}>Thêm thẻ</button>
                <button className="btn btn-ghost" type="button" onClick={addServiceShowcaseStat}>Thêm số liệu</button>
              </div>
            </div>
            <div className="admin-section-meta">
              <Field label="Tiêu đề">
                <input value={draft.serviceShowcase.title} onChange={(event) => updatePath(['serviceShowcase', 'title'], event.target.value)} />
              </Field>
              <Field label="Mô tả">
                <textarea value={draft.serviceShowcase.description} onChange={(event) => updatePath(['serviceShowcase', 'description'], event.target.value)} rows="3" />
              </Field>
            </div>

            <div className="admin-image-grid compact">
              <div className="admin-image-card">
                {draft.serviceShowcase.beforeImage.url && <img src={resolveMediaUrl(draft.serviceShowcase.beforeImage.url)} alt={draft.serviceShowcase.beforeImage.title} />}
                <Field label="Nhãn ảnh trước">
                  <input value={draft.serviceShowcase.beforeLabel} onChange={(event) => updatePath(['serviceShowcase', 'beforeLabel'], event.target.value)} />
                </Field>
                <Field label="Tên ảnh trước">
                  <input value={draft.serviceShowcase.beforeImage.title} onChange={(event) => updatePath(['serviceShowcase', 'beforeImage', 'title'], event.target.value)} />
                </Field>
                <Field label="URL ảnh trước">
                  <input value={draft.serviceShowcase.beforeImage.url} onChange={(event) => updatePath(['serviceShowcase', 'beforeImage', 'url'], event.target.value)} />
                </Field>
                <input type="file" accept="image/*" onChange={(event) => uploadImageToPath(event.target.files?.[0], ['serviceShowcase', 'beforeImage', 'url'])} />
              </div>

              <div className="admin-image-card">
                {draft.serviceShowcase.afterImage.url && <img src={resolveMediaUrl(draft.serviceShowcase.afterImage.url)} alt={draft.serviceShowcase.afterImage.title} />}
                <Field label="Nhãn ảnh sau">
                  <input value={draft.serviceShowcase.afterLabel} onChange={(event) => updatePath(['serviceShowcase', 'afterLabel'], event.target.value)} />
                </Field>
                <Field label="Tên ảnh sau">
                  <input value={draft.serviceShowcase.afterImage.title} onChange={(event) => updatePath(['serviceShowcase', 'afterImage', 'title'], event.target.value)} />
                </Field>
                <Field label="URL ảnh sau">
                  <input value={draft.serviceShowcase.afterImage.url} onChange={(event) => updatePath(['serviceShowcase', 'afterImage', 'url'], event.target.value)} />
                </Field>
                <input type="file" accept="image/*" onChange={(event) => uploadImageToPath(event.target.files?.[0], ['serviceShowcase', 'afterImage', 'url'])} />
              </div>
            </div>

            <div className="admin-subsection">
              <h3>Thẻ nội dung bên phải</h3>
              {draft.serviceShowcase.cards.map((card, index) => (
                <div className="admin-repeat" key={`${card.title}-${index}`}>
                  <Field label="Tiêu đề thẻ">
                    <input value={card.title} onChange={(event) => updateServiceShowcaseCard(index, 'title', event.target.value)} />
                  </Field>
                  <Field label="Icon Phosphor">
                    <input value={card.icon} onChange={(event) => updateServiceShowcaseCard(index, 'icon', event.target.value)} />
                  </Field>
                  <Field label="Màu thẻ">
                    <select value={card.tone} onChange={(event) => updateServiceShowcaseCard(index, 'tone', event.target.value)}>
                      <option value="default">Sáng</option>
                      <option value="primary">Hồng nổi bật</option>
                    </select>
                  </Field>
                  <Field label="Nội dung">
                    <textarea value={card.description} onChange={(event) => updateServiceShowcaseCard(index, 'description', event.target.value)} rows="3" />
                  </Field>
                  <button className="text-button" type="button" onClick={() => removeServiceShowcaseCard(index)}>Xóa thẻ</button>
                </div>
              ))}
            </div>

            <div className="admin-subsection">
              <h3>Số liệu và câu trích dẫn</h3>
              {draft.serviceShowcase.stats.map((stat, index) => (
                <div className="admin-repeat compact-repeat" key={`${stat.label}-${index}`}>
                  <Field label="Số liệu">
                    <input value={stat.value} onChange={(event) => updateServiceShowcaseStat(index, 'value', event.target.value)} />
                  </Field>
                  <Field label="Nhãn">
                    <input value={stat.label} onChange={(event) => updateServiceShowcaseStat(index, 'label', event.target.value)} />
                  </Field>
                  <button className="text-button" type="button" onClick={() => removeServiceShowcaseStat(index)}>Xóa số liệu</button>
                </div>
              ))}
              <div className="admin-section-meta">
                <Field label="Câu trích dẫn">
                  <textarea value={draft.serviceShowcase.quote.text} onChange={(event) => updatePath(['serviceShowcase', 'quote', 'text'], event.target.value)} rows="3" />
                </Field>
                <div>
                  <Field label="Tên người nói">
                    <input value={draft.serviceShowcase.quote.author} onChange={(event) => updatePath(['serviceShowcase', 'quote', 'author'], event.target.value)} />
                  </Field>
                  <Field label="Vai trò">
                    <input value={draft.serviceShowcase.quote.role} onChange={(event) => updatePath(['serviceShowcase', 'quote', 'role'], event.target.value)} />
                  </Field>
                  <Field label="Ảnh đại diện">
                    <input value={draft.serviceShowcase.quote.avatar} onChange={(event) => updatePath(['serviceShowcase', 'quote', 'avatar'], event.target.value)} />
                  </Field>
                  <input type="file" accept="image/*" onChange={(event) => uploadImageToPath(event.target.files?.[0], ['serviceShowcase', 'quote', 'avatar'])} />
                </div>
              </div>
            </div>
          </div>

          <div className="admin-panel wide">
            <div className="admin-panel-heading">
              <h2>Dịch vụ</h2>
              <button className="btn btn-ghost" type="button" onClick={() => addListItem('services', emptyService)}>Thêm dịch vụ</button>
            </div>
            {draft.services.map((service, index) => (
              <div className="admin-repeat" key={`${service.title}-${index}`}>
                <Field label="Tên dịch vụ">
                  <input value={service.title} onChange={(event) => updateListItem('services', index, 'title', event.target.value)} />
                </Field>
                <Field label="Mô tả">
                  <textarea value={service.description} onChange={(event) => updateListItem('services', index, 'description', event.target.value)} rows="3" />
                </Field>
                <Field label="Icon Phosphor">
                  <input value={service.icon} onChange={(event) => updateListItem('services', index, 'icon', event.target.value)} />
                </Field>
                <button className="text-button" type="button" onClick={() => removeListItem('services', index)}>Xóa</button>
              </div>
            ))}
          </div>

          <div className="admin-panel wide">
            <div className="admin-panel-heading">
              <h2>Bảng giá</h2>
              <button className="btn btn-ghost" type="button" onClick={() => addListItem('pricing', emptyPrice)}>Thêm giá</button>
            </div>
            {draft.pricing.map((price, index) => (
              <div className="admin-repeat" key={`${price.name}-${index}`}>
                <Field label="Tên gói">
                  <input value={price.name} onChange={(event) => updateListItem('pricing', index, 'name', event.target.value)} />
                </Field>
                <Field label="Giá">
                  <input value={price.price} onChange={(event) => updateListItem('pricing', index, 'price', event.target.value)} />
                </Field>
                <Field label="Mô tả">
                  <textarea value={price.description} onChange={(event) => updateListItem('pricing', index, 'description', event.target.value)} rows="2" />
                </Field>
                <label className="admin-check">
                  <input type="checkbox" checked={price.featured} onChange={(event) => updateListItem('pricing', index, 'featured', event.target.checked)} />
                  Gói nổi bật
                </label>
                <button className="text-button" type="button" onClick={() => removeListItem('pricing', index)}>Xóa</button>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'images' && (
        <section className="admin-image-sections">
          {draft.gallerySections.map((section, sectionIndex) => (
            <div className="admin-panel" key={section.id}>
              <div className="admin-panel-heading">
                <h2>{section.label}</h2>
                <button className="btn btn-ghost" type="button" onClick={() => addGalleryImage(sectionIndex)}>Thêm ảnh</button>
              </div>
              <div className="admin-section-meta">
                <Field label="Tên khu ảnh">
                  <input value={section.label} onChange={(event) => updateGallerySection(sectionIndex, 'label', event.target.value)} />
                </Field>
                <Field label="Mô tả khu ảnh">
                  <textarea value={section.description} onChange={(event) => updateGallerySection(sectionIndex, 'description', event.target.value)} rows="2" />
                </Field>
              </div>
              <div className="admin-image-grid">
                {section.images.map((image, imageIndex) => (
                  <div className="admin-image-card" key={`${image.url}-${imageIndex}`}>
                    {image.url && <img src={resolveMediaUrl(image.url)} alt={image.title} />}
                    <Field label="Tên ảnh">
                      <input value={image.title} onChange={(event) => updateGalleryImage(sectionIndex, imageIndex, 'title', event.target.value)} />
                    </Field>
                    <Field label="URL ảnh">
                      <input value={image.url} onChange={(event) => updateGalleryImage(sectionIndex, imageIndex, 'url', event.target.value)} />
                    </Field>
                    <input type="file" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0], sectionIndex, imageIndex)} />
                    <button className="text-button" type="button" onClick={() => removeGalleryImage(sectionIndex, imageIndex)}>Xóa ảnh</button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Các khu ảnh trên trang chủ</h2>
                <p>Quản lý các khối như uy tín, phản hồi, bộ sưu tập mi.</p>
              </div>
              <button className="btn btn-ghost" type="button" onClick={addShowcaseSection}>Thêm khu ảnh</button>
            </div>

            {draft.showcaseSections.map((section, sectionIndex) => (
              <div className="admin-care-section" key={`${section.id}-${sectionIndex}`}>
                <div className="admin-panel-heading">
                  <h3>{section.title || 'Khu ảnh chưa đặt tên'}</h3>
                  <div className="admin-mini-actions">
                    <button className="btn btn-ghost" type="button" onClick={() => addShowcaseImage(sectionIndex)}>Thêm ảnh</button>
                    <button className="text-button" type="button" onClick={() => removeShowcaseSection(sectionIndex)}>Xóa khu</button>
                  </div>
                </div>

                <div className="admin-section-meta">
                  <Field label="Tiêu đề khu">
                    <input value={section.title} onChange={(event) => updateShowcaseSection(sectionIndex, 'title', event.target.value)} />
                  </Field>
                  <Field label="Mô tả khu">
                    <textarea value={section.description} onChange={(event) => updateShowcaseSection(sectionIndex, 'description', event.target.value)} rows="2" />
                  </Field>
                  <Field label="Mã khu">
                    <input value={section.id} onChange={(event) => updateShowcaseSection(sectionIndex, 'id', event.target.value)} />
                  </Field>
                  <Field label="Kiểu hiển thị">
                    <select value={section.layout} onChange={(event) => updateShowcaseSection(sectionIndex, 'layout', event.target.value)}>
                      <option value="grid">Lưới ảnh</option>
                      <option value="rail">Chạy ngang</option>
                    </select>
                  </Field>
                </div>

                <div className="admin-image-grid">
                  {section.images.map((image, imageIndex) => (
                    <div className="admin-image-card" key={`${image.url}-${imageIndex}`}>
                      {image.url && <img src={resolveMediaUrl(image.url)} alt={image.title} />}
                      <Field label="Tên ảnh">
                        <input value={image.title} onChange={(event) => updateShowcaseImage(sectionIndex, imageIndex, 'title', event.target.value)} />
                      </Field>
                      <Field label="URL ảnh">
                        <input value={image.url} onChange={(event) => updateShowcaseImage(sectionIndex, imageIndex, 'url', event.target.value)} />
                      </Field>
                      <input type="file" accept="image/*" onChange={(event) => uploadImageToPath(event.target.files?.[0], ['showcaseSections', sectionIndex, 'images', imageIndex, 'url'])} />
                      <button className="text-button" type="button" onClick={() => removeShowcaseImage(sectionIndex, imageIndex)}>Xóa ảnh</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'aftercare' && (
        <section className="admin-image-sections">
          <div className="admin-panel">
            <h2>Trang hướng dẫn chăm sóc</h2>
            <div className="admin-section-meta">
              <Field label="Nhãn nhỏ">
                <input value={draft.aftercare.badge} onChange={(event) => updatePath(['aftercare', 'badge'], event.target.value)} />
              </Field>
              <Field label="Tiêu đề chính">
                <input value={draft.aftercare.title} onChange={(event) => updatePath(['aftercare', 'title'], event.target.value)} />
              </Field>
            </div>
            <Field label="Mô tả đầu trang">
              <textarea value={draft.aftercare.description} onChange={(event) => updatePath(['aftercare', 'description'], event.target.value)} rows="3" />
            </Field>
          </div>

          <div className="admin-panel">
            <div className="admin-panel-heading">
              <h2>Các nhóm hướng dẫn</h2>
              <button className="btn btn-ghost" type="button" onClick={addCareSection}>Thêm nhóm</button>
            </div>

            {draft.aftercare.sections.map((section, sectionIndex) => (
              <div className="admin-care-section" key={`${section.id}-${sectionIndex}`}>
                <div className="admin-section-meta">
                  <Field label="Tên nhóm">
                    <input value={section.title} onChange={(event) => updateCareSection(sectionIndex, 'title', event.target.value)} />
                  </Field>
                  <Field label="Icon Phosphor">
                    <input value={section.icon} onChange={(event) => updateCareSection(sectionIndex, 'icon', event.target.value)} />
                  </Field>
                </div>
                <div className="admin-panel-heading">
                  <h3>{section.title || 'Nhóm chưa đặt tên'}</h3>
                  <div className="admin-mini-actions">
                    <button className="btn btn-ghost" type="button" onClick={() => addCareCard(sectionIndex)}>Thêm thẻ</button>
                    <button className="text-button" type="button" onClick={() => removeCareSection(sectionIndex)}>Xóa nhóm</button>
                  </div>
                </div>

                {(section.cards || []).map((card, cardIndex) => (
                  <div className="admin-repeat care-repeat" key={`${card.title}-${cardIndex}`}>
                    <Field label="Tiêu đề thẻ">
                      <input value={card.title} onChange={(event) => updateCareCard(sectionIndex, cardIndex, 'title', event.target.value)} />
                    </Field>
                    <Field label="Icon">
                      <input value={card.icon} onChange={(event) => updateCareCard(sectionIndex, cardIndex, 'icon', event.target.value)} />
                    </Field>
                    <Field label="Kiểu hiển thị">
                      <select value={card.tone} onChange={(event) => updateCareCard(sectionIndex, cardIndex, 'tone', event.target.value)}>
                        <option value="default">Từng bước</option>
                        <option value="primary">Nên làm</option>
                        <option value="warning">Cần tránh</option>
                      </select>
                    </Field>
                    <Field label="Mô tả thẻ">
                      <textarea value={card.description} onChange={(event) => updateCareCard(sectionIndex, cardIndex, 'description', event.target.value)} rows="2" />
                    </Field>
                    <div className="admin-care-items">
                      <div className="admin-panel-heading">
                        <h4>Gạch đầu dòng</h4>
                        <button className="text-button" type="button" onClick={() => addCareItem(sectionIndex, cardIndex)}>Thêm dòng</button>
                      </div>
                      {(card.items || []).map((item, itemIndex) => (
                        <div className="admin-care-item" key={`${itemIndex}-${item.slice(0, 12)}`}>
                          <textarea value={item} onChange={(event) => updateCareItem(sectionIndex, cardIndex, itemIndex, event.target.value)} rows="2" />
                          <button className="text-button" type="button" onClick={() => removeCareItem(sectionIndex, cardIndex, itemIndex)}>Xóa</button>
                        </div>
                      ))}
                    </div>
                    <button className="text-button" type="button" onClick={() => removeCareCard(sectionIndex, cardIndex)}>Xóa thẻ</button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="admin-panel">
            <h2>Khối hỗ trợ cuối trang</h2>
            <div className="admin-section-meta">
              <Field label="Tiêu đề">
                <input value={draft.aftercare.cta.title} onChange={(event) => updatePath(['aftercare', 'cta', 'title'], event.target.value)} />
              </Field>
              <Field label="Nút gọi điện">
                <input value={draft.aftercare.cta.primaryText} onChange={(event) => updatePath(['aftercare', 'cta', 'primaryText'], event.target.value)} />
              </Field>
            </div>
            <Field label="Mô tả">
              <textarea value={draft.aftercare.cta.description} onChange={(event) => updatePath(['aftercare', 'cta', 'description'], event.target.value)} rows="3" />
            </Field>
            <Field label="Nút Messenger">
              <input value={draft.aftercare.cta.secondaryText} onChange={(event) => updatePath(['aftercare', 'cta', 'secondaryText'], event.target.value)} />
            </Field>
          </div>
        </section>
      )}

      {activeTab === 'bookings' && (
        <section className="admin-panel">
          <h2>Lịch hẹn</h2>
          <div className="booking-filter-tabs" role="tablist" aria-label="Lọc lịch hẹn">
            {bookingTabs.map((tab) => (
              <button
                className={bookingView === tab.id ? 'active' : ''}
                type="button"
                onClick={() => setBookingView(tab.id)}
                key={tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="booking-table">
            {filteredBookings.length === 0 && <p>Chưa có lịch hẹn trong mục này.</p>}
            {filteredBookings.map((booking) => (
              <div className="booking-row" key={booking.id}>
                <div>
                  <strong>{booking.name}</strong>
                  <p>{booking.phone} · {booking.service}</p>
                  <p>{booking.date} lúc {booking.time}</p>
                  {booking.status === 'rescheduled' && (
                    <p>Hẹn lại: {booking.rescheduledDate || 'chưa chọn ngày'} lúc {booking.rescheduledTime || 'chưa chọn giờ'}</p>
                  )}
                  {booking.note && <p>{booking.note}</p>}
                </div>
                <div className="booking-actions">
                  <select value={booking.status || 'new'} onChange={(event) => updateBookingStatus(booking.id, event.target.value)}>
                    <option value="new">Khách mới</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="rescheduled">Khách hẹn lại</option>
                    <option value="done">Hoàn thành</option>
                    <option value="cancelled">Hủy</option>
                  </select>
                  {booking.status === 'rescheduled' && (
                    <div className="booking-reschedule">
                      <input
                        className="input-field"
                        type="date"
                        value={booking.rescheduledDate || ''}
                        onChange={(event) => updateBookingSchedule(booking.id, 'rescheduledDate', event.target.value)}
                      />
                      <input
                        className="input-field"
                        type="time"
                        value={booking.rescheduledTime || ''}
                        onChange={(event) => updateBookingSchedule(booking.id, 'rescheduledTime', event.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab !== 'bookings' && (
        <div className="admin-savebar">
          <button className="btn btn-primary" type="button" onClick={saveContent}>Lưu thay đổi</button>
        </div>
      )}
    </main>
  );
}
