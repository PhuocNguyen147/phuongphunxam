import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '../api';

const emptyService = { title: '', description: '', icon: 'ph-sparkle' };
const emptyImage = { title: '', url: '' };
const emptyPrice = { name: '', price: '', description: '', featured: false };
const defaultGallerySections = [
  { id: 'lips', label: 'Ảnh làm môi', description: '', images: [] },
  { id: 'lashes', label: 'Ảnh làm mi', description: '', images: [] },
  { id: 'brows', label: 'Ảnh làm mày', description: '', images: [] },
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
  if (Array.isArray(content.gallerySections)) return content;

  return {
    ...content,
    gallerySections: defaultGallerySections.map((section) => ({ ...section, images: content.gallery || [] })),
  };
}

export default function Admin({ initialContent, setContent }) {
  const [draft, setDraft] = useState(() => normalizeDraft(initialContent));
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState('');
  const [activeTab, setActiveTab] = useState('content');
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

  const uploadImage = async (file, sectionIndex, imageIndex) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setStatus('Đang tải ảnh lên...');
        const uploaded = await api.uploadImage({ name: file.name, dataUrl: reader.result });
        updateGalleryImage(sectionIndex, imageIndex, 'url', uploaded.url);
        setStatus('Ảnh đã tải lên, bấm Lưu thay đổi để cập nhật website.');
      } catch (error) {
        handleAuthError(error);
      }
    };
    reader.readAsDataURL(file);
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
      const updated = await api.updateBooking(bookingId, { status: value });
      setBookings((current) => current.map((booking) => booking.id === bookingId ? updated : booking));
    } catch (error) {
      handleAuthError(error);
    }
  };

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
        </section>
      )}

      {activeTab === 'bookings' && (
        <section className="admin-panel">
          <h2>Lịch hẹn mới</h2>
          <div className="booking-table">
            {bookings.length === 0 && <p>Chưa có lịch hẹn.</p>}
            {bookings.map((booking) => (
              <div className="booking-row" key={booking.id}>
                <div>
                  <strong>{booking.name}</strong>
                  <p>{booking.phone} · {booking.service}</p>
                  <p>{booking.date} lúc {booking.time}</p>
                  {booking.note && <p>{booking.note}</p>}
                </div>
                <select value={booking.status} onChange={(event) => updateBookingStatus(booking.id, event.target.value)}>
                  <option value="new">Mới</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="done">Hoàn thành</option>
                  <option value="cancelled">Hủy</option>
                </select>
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
