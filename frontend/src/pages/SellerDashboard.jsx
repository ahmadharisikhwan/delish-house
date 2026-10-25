import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function SellerDashboard({ currentUser, onLogout, onSwitchToBuyer, onGoHome, onShowToast }) {
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' | 'ai-promo' | 'orders' | 'profile'
  const [merchantData, setMerchantData] = useState(null);
  const [menus, setMenus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpenStore, setIsOpenStore] = useState(true);

  // Modal Tambah Menu State
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [isGeneratingAiDesc, setIsGeneratingAiDesc] = useState(false);
  const [newMenu, setNewMenu] = useState({
    name: '',
    category: 'Makanan Berat',
    price: '',
    description: '',
    spice_level: 0,
    is_bestseller: false,
    is_recommended: true
  });

  // AI Copywriter State inside Dashboard
  const [promoItem, setPromoItem] = useState('');
  const [promoTone, setPromoTone] = useState('promo');
  const [promoResult, setPromoResult] = useState(null);
  const [isGeneratingPromo, setIsGeneratingPromo] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    name: '',
    owner_name: '',
    phone: '',
    whatsapp: '',
    city: '',
    address: '',
    description: ''
  });

  const merchantId = currentUser?.merchantId || currentUser?.id || 1;

  useEffect(() => {
    loadMerchantDetails();
  }, [merchantId]);

  const loadMerchantDetails = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMerchantById(merchantId);
      if (data) {
        setMerchantData(data);
        setMenus(data.menus || []);
        setOrders(data.orders || []);
        setProfileForm({
          name: data.name || '',
          owner_name: data.owner_name || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          city: data.city || '',
          address: data.address || '',
          description: data.description || ''
        });
      } else {
        // Fallback for demo or newly registered seller
        setMerchantData(currentUser);
        setMenus(currentUser?.menus || [
          { id: 101, name: 'Menu Spesial Toko', category: 'Makanan Berat', price: 25000, description: 'Menu racikan lezat dengan bumbu nusantara pilihan.', is_bestseller: 1 }
        ]);
        setProfileForm({
          name: currentUser.name || 'Usaha Kuliner Saya',
          owner_name: currentUser.ownerName || 'Pemilik',
          phone: currentUser.phone || '08123456789',
          whatsapp: currentUser.whatsapp || '628123456789',
          city: currentUser.city || 'Sidoarjo',
          address: currentUser.address || 'Jl. Raya Kuliner No. 1',
          description: currentUser.description || 'Penyaji kuliner lezat khas lokal.'
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Tambah Menu Baru
  const handleSaveMenu = async (e) => {
    e.preventDefault();
    if (!newMenu.name || !newMenu.price) {
      onShowToast('Nama menu dan harga wajib diisi!');
      return;
    }

    try {
      const res = await apiService.addMerchantMenu(merchantId, newMenu);
      if (res.success) {
        onShowToast(`Menu "${newMenu.name}" berhasil ditambahkan!`);
        setShowAddMenuModal(false);
        setNewMenu({
          name: '',
          category: 'Makanan Berat',
          price: '',
          description: '',
          spice_level: 0,
          is_bestseller: false,
          is_recommended: true
        });
        loadMerchantDetails();
      }
    } catch (err) {
      console.error(err);
      onShowToast('Gagal menambahkan menu.');
    }
  };

  // Auto-generate AI Description for new menu
  const handleAiAutoDescription = async () => {
    if (!newMenu.name) {
      onShowToast('Ketik nama menu terlebih dahulu untuk membuat deskripsi AI.');
      return;
    }
    setIsGeneratingAiDesc(true);
    try {
      const res = await apiService.generateCopywriter({
        productName: newMenu.name,
        category: newMenu.category,
        tone: 'appetizing'
      });
      if (res.success && res.data?.description) {
        setNewMenu(prev => ({ ...prev, description: res.data.description }));
        onShowToast('Deskripsi lezat berhasil diracik otomatis oleh AI!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAiDesc(false);
    }
  };

  // Handle Hapus Menu
  const handleDeleteMenu = async (menuId, menuName) => {
    if (window.confirm(`Yakin ingin menghapus menu "${menuName}" dari katalog toko?`)) {
      try {
        await apiService.deleteMerchantMenu(menuId);
        onShowToast(`Menu "${menuName}" berhasil dihapus.`);
        setMenus(prev => prev.filter(m => m.id !== menuId));
      } catch (err) {
        console.error(err);
        onShowToast('Gagal menghapus menu.');
      }
    }
  };

  // Handle AI Copywriter Promo inside Dashboard
  const handleGeneratePromo = async (e) => {
    e.preventDefault();
    const targetName = promoItem || (menus[0]?.name || 'Menu Spesial Toko');
    setIsGeneratingPromo(true);
    try {
      const res = await apiService.generateCopywriter({
        productName: targetName,
        tone: promoTone
      });
      if (res.success) {
        setPromoResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPromo(false);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await apiService.updateMerchantProfile(merchantId, profileForm);
      onShowToast('Informasi toko berhasil diperbarui!');
      setMerchantData(prev => ({ ...prev, ...profileForm }));
    } catch (err) {
      console.error(err);
      onShowToast('Gagal memperbarui profil toko.');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    onShowToast('Teks berhasil disalin ke clipboard!');
  };

  return (
    <div className="dashboard-container">
      {/* Top Seller Bar */}
      <div className="dash-top-bar">
        <div className="container dash-top-flex">
          <div className="dash-brand-area">
            <button type="button" onClick={onGoHome} className="dash-back-home-btn" title="Kembali ke Beranda">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <img src="/assets/logo.webp" alt="Delish House" style={{ height: '36px' }} />
            <div className="dash-role-badge badge-seller">
              <i className="fa-solid fa-store"></i>
              <span>PORTAL MITRA PENJUAL (UMKM)</span>
            </div>
          </div>

          <div className="dash-top-actions">
            <button
              type="button"
              className="btn btn-outline dash-mode-btn"
              onClick={onSwitchToBuyer}
              title="Beralih untuk melihat pengalaman belanja konsumen"
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Lihat Tampilan Pembeli</span>
            </button>
            <button
              type="button"
              className="dash-logout-btn"
              onClick={onLogout}
              title="Keluar dari akun toko"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container dash-content-layout">
        {/* Merchant Hero Banner */}
        <div className="merchant-header-card">
          <div className="merchant-header-info">
            <div className="merchant-avatar-circle">
              <i className="fa-solid fa-utensils"></i>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 className="merchant-name-title">{merchantData?.name || profileForm.name || 'Lapak Kuliner UMKM'}</h1>
                <span className="verified-badge">
                  <i className="fa-solid fa-circle-check"></i> Mitra Terverifikasi
                </span>
              </div>
              <p className="merchant-meta-sub">
                <i className="fa-solid fa-user-tie" style={{ marginRight: '5px' }}></i>
                Pemilik: <strong>{merchantData?.owner_name || profileForm.owner_name || 'Bapak/Ibu Mitra'}</strong> •
                <i className="fa-solid fa-location-dot" style={{ margin: '0 5px 0 10px' }}></i>
                {merchantData?.city || profileForm.city || 'Sidoarjo'} •
                <i className="fa-brands fa-whatsapp" style={{ margin: '0 5px 0 10px', color: '#22c55e' }}></i>
                {merchantData?.whatsapp || profileForm.whatsapp || '08xxxxxxxxxx'}
              </p>
            </div>
          </div>

          <div className="store-status-toggle-wrap">
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status Lapak:</span>
            <button
              type="button"
              className={`status-pill-toggle ${isOpenStore ? 'open' : 'closed'}`}
              onClick={() => {
                setIsOpenStore(!isOpenStore);
                onShowToast(isOpenStore ? 'Lapak diatur TUTUP sementara.' : 'Lapak sekarang BUKA dan menerima pesanan!');
              }}
            >
              <span className="status-dot"></span>
              <span>{isOpenStore ? 'Lapak BUKA' : 'Lapak TUTUP'}</span>
            </button>
          </div>
        </div>

        {/* 4 Analytics Metrics Cards */}
        <div className="dash-metrics-grid">
          <div className="metric-box">
            <div className="metric-icon icon-blue">
              <i className="fa-solid fa-bowl-food"></i>
            </div>
            <div>
              <div className="metric-number">{menus.length}</div>
              <div className="metric-label">Menu Aktif di Etalase</div>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon icon-orange">
              <i className="fa-solid fa-eye"></i>
            </div>
            <div>
              <div className="metric-number">1.428</div>
              <div className="metric-label">Kunjungan Pelanggan (Bulan Ini)</div>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon icon-green">
              <i className="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <div className="metric-number">{orders.length + 18}</div>
              <div className="metric-label">Pesanan WhatsApp Masuk</div>
            </div>
          </div>

          <div className="metric-box">
            <div className="metric-icon icon-gold">
              <i className="fa-solid fa-star"></i>
            </div>
            <div>
              <div className="metric-number">{merchantData?.rating || '4.9'} / 5.0</div>
              <div className="metric-label">Rating Kepuasan Konsumen</div>
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Navigation */}
        <div className="dash-tab-nav">
          <button
            type="button"
            className={`dash-tab-link ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>Kelola Menu & Harga ({menus.length})</span>
          </button>

          <button
            type="button"
            className={`dash-tab-link ${activeTab === 'ai-promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-promo')}
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>AI Asisten Promosi & Copywriter</span>
          </button>

          <button
            type="button"
            className={`dash-tab-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <i className="fa-solid fa-inbox"></i>
            <span>Pesanan Masuk ({orders.length})</span>
          </button>

          <button
            type="button"
            className={`dash-tab-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-gear"></i>
            <span>Profil & Alamat Usaha</span>
          </button>
        </div>

        {/* Tab 1: Menu Management */}
        {activeTab === 'menu' && (
          <div className="dash-tab-content">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-sec-title">Daftar Menu Sajian Kuliner</h2>
                <p className="dash-sec-desc">Atur nama sajian, harga jual, dan deskripsi menu yang tampil di katalog pembeli.</p>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowAddMenuModal(true)}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Tambah Menu Baru</span>
              </button>
            </div>

            {loading ? (
              <div className="dash-loading-state">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <p>Memuat daftar menu...</p>
              </div>
            ) : menus.length === 0 ? (
              <div className="dash-empty-state">
                <i className="fa-solid fa-utensils"></i>
                <h3>Belum Ada Menu di Etalase</h3>
                <p>Mulai tambahkan menu pertama usahamu agar pembeli dapat memesan!</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}
                  onClick={() => setShowAddMenuModal(true)}
                >
                  <i className="fa-solid fa-plus"></i> Tambah Menu Sekarang
                </button>
              </div>
            ) : (
              <div className="seller-menu-grid">
                {menus.map((item) => (
                  <div className="seller-menu-card" key={item.id}>
                    <div className="seller-menu-img-wrap">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'}
                        alt={item.name}
                        className="seller-menu-img"
                      />
                      {item.is_bestseller ? <span className="menu-badge bestseller">⭐ Terlaris</span> : null}
                    </div>

                    <div className="seller-menu-body">
                      <div className="seller-menu-title-row">
                        <h4 className="seller-menu-name">{item.name}</h4>
                        <span className="seller-menu-price">Rp {item.price?.toLocaleString('id-ID')}</span>
                      </div>
                      <span className="seller-menu-cat">{item.category}</span>
                      <p className="seller-menu-desc">{item.description || 'Sajian lezat dibuat dengan bahan pilihan terbaik.'}</p>

                      <div className="seller-menu-actions">
                        <button
                          type="button"
                          className="btn-menu-action btn-promo-ai"
                          onClick={() => {
                            setPromoItem(item.name);
                            setActiveTab('ai-promo');
                          }}
                          title="Buatkan kata-kata promosi AI untuk menu ini"
                        >
                          <i className="fa-solid fa-wand-magic-sparkles"></i> Buat Promo AI
                        </button>
                        <button
                          type="button"
                          className="btn-menu-action btn-delete-menu"
                          onClick={() => handleDeleteMenu(item.id, item.name)}
                          title="Hapus menu ini"
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI Copywriter & Promo Assistant */}
        {activeTab === 'ai-promo' && (
          <div className="dash-tab-content">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-sec-title">AI Asisten Promosi & Copywriter Penjual</h2>
                <p className="dash-sec-desc">Hemat waktu merangkai kata! Buat deskripsi promo WhatsApp dan media sosial secara otomatis dalam hitungan detik.</p>
              </div>
            </div>

            <div className="dash-promo-grid">
              <form onSubmit={handleGeneratePromo} className="promo-form-card">
                <div className="form-group">
                  <label className="form-label">Pilih Menu yang Ingin Dipromosikan</label>
                  <input
                    type="text"
                    className="form-input"
                    value={promoItem}
                    onChange={(e) => setPromoItem(e.target.value)}
                    placeholder="Contoh: Bebek Goreng Sambal Pencit"
                    required
                  />
                  {menus.length > 0 && (
                    <div className="quick-select-chips">
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pilih cepat:</span>
                      {menus.slice(0, 4).map(m => (
                        <button
                          key={m.id}
                          type="button"
                          className="chip-btn"
                          onClick={() => setPromoItem(m.name)}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Target Gaya Pesan Promosi</label>
                  <select
                    className="form-select"
                    value={promoTone}
                    onChange={(e) => setPromoTone(e.target.value)}
                  >
                    <option value="promo">🔥 Promo & Diskon Spesial Hari Ini (Bikin Pesan Cepat)</option>
                    <option value="appetizing">🤤 Menggugah Selera (Fokus Kelezatan Rempah & Rasa)</option>
                    <option value="casual">🤙 Santai & Nongkrong (Gaya Gaul Anak Muda)</option>
                    <option value="storytelling">🌿 Resep Tradisional & Warisan Legendaris</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isGeneratingPromo}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <i className={`fa-solid ${isGeneratingPromo ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                  <span>{isGeneratingPromo ? 'AI Sedang Meracik Teks Promo...' : 'Generate Teks Promo Sekarang'}</span>
                </button>
              </form>

              {/* Promo Result Display */}
              <div className="promo-result-card">
                {promoResult ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="badge-pill badge-blue">
                        <i className="fa-solid fa-sparkles"></i> Siap Pakai
                      </span>
                      <button
                        type="button"
                        className="copy-btn"
                        onClick={() => copyToClipboard(`${promoResult.title}\n\n${promoResult.description}\n\n${promoResult.instagramCaption}`)}
                      >
                        <i className="fa-solid fa-copy"></i> Salin Semua Teks
                      </button>
                    </div>

                    <h4 style={{ color: 'var(--navy-dark)', fontSize: '1.1rem', marginBottom: '8px' }}>
                      {promoResult.title}
                    </h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '16px' }}>
                      {promoResult.description}
                    </p>

                    <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#16A34A' }}>
                          <i className="fa-brands fa-whatsapp"></i> Siap Broadcast ke WhatsApp Pelanggan:
                        </strong>
                        <button
                          type="button"
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                          onClick={() => copyToClipboard(promoResult.instagramCaption)}
                        >
                          Salin Pesan Ini
                        </button>
                      </div>
                      <p style={{ fontSize: '0.88rem', whiteSpace: 'pre-wrap', color: 'var(--text-body)' }}>
                        {promoResult.instagramCaption}
                      </p>
                    </div>

                    <div className="ai-tag-pills">
                      {promoResult.hashtags?.map((t, idx) => (
                        <span key={idx} className="ai-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="promo-empty-box">
                    <i className="fa-solid fa-bullhorn" style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '12px' }}></i>
                    <h4>Teks Promosi AI Akan Muncul di Sini</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Pilih menu usahamu lalu klik tombol racik untuk membuat materi promosi instan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Incoming Orders */}
        {activeTab === 'orders' && (
          <div className="dash-tab-content">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-sec-title">Pesanan & Pesan Masuk dari Pembeli</h2>
                <p className="dash-sec-desc">Daftar calon pembeli yang memesan menu usahamu melalui platform Delish House.</p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="dash-empty-state">
                <i className="fa-solid fa-inbox"></i>
                <h3>Belum Ada Pesanan Baru</h3>
                <p>Ketika pembeli menekan tombol pesan di katalog, ringkasan pesanan akan dicatat di sini.</p>
              </div>
            ) : (
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nama Pembeli</th>
                      <th>Nomor WhatsApp</th>
                      <th>Ringkasan Menu Dipesan</th>
                      <th>Total Tagihan</th>
                      <th>Catatan Tambahan</th>
                      <th>Status</th>
                      <th>Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td><strong>#{ord.id}</strong></td>
                        <td><strong>{ord.buyer_name}</strong></td>
                        <td>{ord.buyer_phone}</td>
                        <td style={{ maxWidth: '280px' }}>{ord.items_summary}</td>
                        <td style={{ fontWeight: 700, color: 'var(--primary)' }}>
                          Rp {ord.total_price?.toLocaleString('id-ID')}
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{ord.notes || '-'}</td>
                        <td>
                          <span className={`order-status-badge ${ord.status?.toLowerCase()}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td>
                          <a
                            href={`https://wa.me/${ord.buyer_phone?.replace(/\D/g, '')}?text=Halo%20kak%20${encodeURIComponent(ord.buyer_name)},%20kami%20dari%20${encodeURIComponent(merchantData?.name || 'Delish House')}.%20Pesanan%20kakak%20sedang%20kami%20siapkan!`}
                            target="_blank"
                            rel="noreferrer"
                            className="btn-order-wa"
                          >
                            <i className="fa-brands fa-whatsapp"></i> Balas Chat
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Profile & Settings */}
        {activeTab === 'profile' && (
          <div className="dash-tab-content">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-sec-title">Profil & Pengaturan Lapak UMKM</h2>
                <p className="dash-sec-desc">Perbarui informasi kontak, alamat lapak, dan deskripsi usahamu agar pembeli mudah menemukanmu.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="seller-profile-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Nama Lapak / Usaha Kuliner</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nama Pemilik Usaha</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.owner_name}
                    onChange={(e) => setProfileForm({ ...profileForm, owner_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Kota / Lokasi</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nomor WhatsApp Usaha (Untuk Pesanan)</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={profileForm.whatsapp}
                    onChange={(e) => setProfileForm({ ...profileForm, whatsapp: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Lengkap Lapak</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  placeholder="Contoh: Jl. Mojopahit No. 25, Sidokumpul, Sidoarjo"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deskripsi Usaha & Ciri Khas Makanan</label>
                <textarea
                  className="form-input"
                  rows={4}
                  value={profileForm.description}
                  onChange={(e) => setProfileForm({ ...profileForm, description: e.target.value })}
                  placeholder="Ceritakan sejarah atau kelezatan resep khas usahamu..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                <i className="fa-solid fa-floppy-disk"></i>
                <span>Simpan Perubahan Profil</span>
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Modal Tambah Menu Baru */}
      {showAddMenuModal && (
        <div className="modal-overlay active" onClick={(e) => { if (e.target.className.includes('modal-overlay')) setShowAddMenuModal(false); }}>
          <div className="modal-card" style={{ maxWidth: '580px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setShowAddMenuModal(false)}>&times;</button>
            <div className="modal-header">
              <div className="modal-badge"><span>Katalog Menu</span></div>
              <h3 className="modal-title">Tambah Sajian Kuliner Baru</h3>
              <p className="modal-subtitle">Isi detail sajian untuk ditampilkan ke ribuan pembeli lokal.</p>
            </div>

            <form onSubmit={handleSaveMenu} className="modal-form">
              <div className="form-group">
                <label className="form-label">Nama Menu Makanan / Minuman</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Ayam Geprek Sambal Korek"
                  value={newMenu.name}
                  onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Kategori</label>
                  <select
                    className="form-select"
                    value={newMenu.category}
                    onChange={(e) => setNewMenu({ ...newMenu, category: e.target.value })}
                  >
                    <option value="Makanan Berat">Makanan Berat</option>
                    <option value="Minuman & Kopi">Minuman & Kopi</option>
                    <option value="Camilan & Gorengan">Camilan & Gorengan</option>
                    <option value="Dessert & Manisan">Dessert & Manisan</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Harga Jual (Rp)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="20000"
                    value={newMenu.price}
                    onChange={(e) => setNewMenu({ ...newMenu, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>Deskripsi Menu</label>
                  <button
                    type="button"
                    className="btn-ai-magic-small"
                    onClick={handleAiAutoDescription}
                    disabled={isGeneratingAiDesc}
                  >
                    <i className={`fa-solid ${isGeneratingAiDesc ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                    <span>{isGeneratingAiDesc ? 'Meracik...' : 'AI Auto-Deskripsi'}</span>
                  </button>
                </div>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="Jelaskan bumbu, rasa, dan keunikan menu ini..."
                  value={newMenu.description}
                  onChange={(e) => setNewMenu({ ...newMenu, description: e.target.value })}
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '20px', margin: '8px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={newMenu.is_bestseller}
                    onChange={(e) => setNewMenu({ ...newMenu, is_bestseller: e.target.checked })}
                  />
                  <span>Tandai Menu Terlaris (Bestseller)</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary modal-submit-btn">
                <i className="fa-solid fa-plus"></i>
                <span>Simpan Menu ke Lapak</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

