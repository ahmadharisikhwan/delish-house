import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const categories = [
  { id: 'all', label: 'Semua Sajian' },
  { id: 'Makanan Berat', label: 'Makanan Berat' },
  { id: 'Minuman & Kopi', label: 'Minuman & Kopi' },
  { id: 'Camilan & Gorengan', label: 'Camilan & Gorengan' },
  { id: 'Dessert & Manisan', label: 'Dessert & Manisan' }
];

export default function BuyerPortal({ currentUser, onLogout, onSwitchToSeller, onGoHome, onShowToast }) {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'ai-rec' | 'favorites'

  // Cart / Order State
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');

  // AI Recommendation State
  const [aiBudget, setAiBudget] = useState('hemat');
  const [aiMood, setAiMood] = useState('pedas');
  const [aiCity, setAiCity] = useState(currentUser?.city || 'Sidoarjo');
  const [aiRecResults, setAiRecResults] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    loadMerchants();
  }, [selectedCategory, searchQuery, selectedCity]);

  const loadMerchants = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMerchants({
        category: selectedCategory,
        city: selectedCity,
        q: searchQuery
      });
      setMerchants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Favorite
  const toggleFavorite = (item) => {
    if (favorites.some(f => f.id === item.id)) {
      setFavorites(favorites.filter(f => f.id !== item.id));
      onShowToast(`Menu "${item.name}" dihapus dari favorit.`);
    } else {
      setFavorites([...favorites, item]);
      onShowToast(`Menu "${item.name}" disimpan ke favorit! ❤️`);
    }
  };

  // Add item to cart
  const addToCart = (menu, merchant) => {
    const existing = cart.find(c => c.menu.id === menu.id);
    if (existing) {
      setCart(cart.map(c => c.menu.id === menu.id ? { ...c, qty: c.qty + 1 } : c));
    } else {
      setCart([...cart, { menu, merchant, qty: 1 }]);
    }
    onShowToast(`"${menu.name}" ditambahkan ke keranjang pesanan! 🛒`);
  };

  const removeFromCart = (menuId) => {
    setCart(cart.filter(c => c.menu.id !== menuId));
  };

  const updateQty = (menuId, delta) => {
    setCart(cart.map(c => {
      if (c.menu.id === menuId) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const totalCartPrice = cart.reduce((sum, c) => sum + (c.menu.price * c.qty), 0);

  // Send Order via WhatsApp & Record in Database
  const handleCheckoutWhatsApp = async () => {
    if (cart.length === 0) return;

    const targetMerchant = cart[0]?.merchant;
    const itemsSummary = cart.map(c => `${c.qty}x ${c.menu.name} (Rp ${(c.menu.price * c.qty).toLocaleString('id-ID')})`).join(', ');

    // 1. Record to database
    try {
      await apiService.createOrder({
        merchant_id: targetMerchant?.id || 1,
        buyer_name: currentUser?.name || 'Pelanggan Delish House',
        buyer_phone: currentUser?.phone || '08xxxxxxxxxx',
        items_summary: itemsSummary,
        total_price: totalCartPrice,
        notes: orderNotes
      });
    } catch (err) {
      console.error(err);
    }

    // 2. Open WhatsApp format
    const buyerName = currentUser?.name || 'Pembeli';
    const waNumber = targetMerchant?.whatsapp || targetMerchant?.phone?.replace(/\D/g, '') || '6281234567890';
    const textLines = [
      `Halo *${targetMerchant?.name}*, saya *${buyerName}* ingin memesan via Delish House:`,
      ``,
      `📋 *Daftar Pesanan:*`,
      ...cart.map(c => `• ${c.qty}x ${c.menu.name} - Rp ${(c.menu.price * c.qty).toLocaleString('id-ID')}`),
      ``,
      `💰 *Total Tagihan:* Rp ${totalCartPrice.toLocaleString('id-ID')}`,
      orderNotes ? `📝 *Catatan:* ${orderNotes}` : ``,
      `📍 *Kota Pemesan:* ${currentUser?.city || 'Sidoarjo'}`,
      ``,
      `Mohon info ketersediaan & alamat pengirimannya ya kak. Terima kasih! 🙏`
    ];

    const message = encodeURIComponent(textLines.filter(Boolean).join('\n'));
    window.open(`https://wa.me/${waNumber}?text=${message}`, '_blank');

    setShowCartModal(false);
    setCart([]);
    setOrderNotes('');
    onShowToast('Pesanan berhasil dibuat & dialihkan langsung ke WhatsApp Pedagang!');
  };

  // Run AI Recommendation
  const handleRunAiRec = async (e) => {
    if (e) e.preventDefault();
    setIsAiLoading(true);
    try {
      const res = await apiService.getAiRecommendations({
        budget: aiBudget,
        mood: aiMood,
        city: aiCity
      });
      if (res.success) {
        setAiRecResults(res);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Gagal memproses rekomendasi AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="buyer-portal-container">
      {/* Top Buyer Bar */}
      <div className="dash-top-bar">
        <div className="container dash-top-flex">
          <div className="dash-brand-area">
            <button type="button" onClick={onGoHome} className="dash-back-home-btn" title="Kembali ke Beranda">
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <img src="/assets/logo.webp" alt="Delish House" style={{ height: '36px' }} />
            <div className="dash-role-badge badge-buyer">
              <i className="fa-solid fa-utensils"></i>
              <span>PORTAL PEMBELI & PECINTA KULINER</span>
            </div>
          </div>

          <div className="dash-top-actions">
            {/* Cart Button */}
            <button
              type="button"
              className="buyer-cart-top-btn"
              onClick={() => setShowCartModal(true)}
              title="Lihat Keranjang Pesanan"
            >
              <i className="fa-solid fa-basket-shopping"></i>
              <span>Pesanan ({cart.reduce((s, c) => s + c.qty, 0)})</span>
            </button>

            {/* Switch to Seller Mode */}
            <button
              type="button"
              className="btn btn-outline dash-mode-btn"
              onClick={onSwitchToSeller}
              title="Beralih ke Portal Mitra Penjual"
            >
              <i className="fa-solid fa-store"></i>
              <span>Mode Penjual UMKM</span>
            </button>

            {/* Logout */}
            <button
              type="button"
              className="dash-logout-btn"
              onClick={onLogout}
              title="Keluar dari akun"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '30px 24px 80px' }}>
        {/* Welcome Greeting Banner */}
        <div className="buyer-welcome-banner">
          <div className="buyer-welcome-content">
            <div className="badge-pill badge-blue" style={{ marginBottom: '10px' }}>
              <span>Dukung UMKM Kuliner Lokal 100% Bebas Komisi</span>
            </div>
            <h1 className="buyer-title">
              Halo, <span className="text-orange">{currentUser?.name || 'Pencinta Kuliner'}</span>! 😋
            </h1>
            <p className="buyer-subtitle">
              Temukan aneka santapan khas lokal legendaris di sekitarmu, minta rekomendasi AI sesuai anggaran, dan pesan langsung tanpa potongan komisi!
            </p>

            {/* Quick Mood Chips */}
            <div className="quick-mood-row">
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Cari Cepat:</span>
              <button
                type="button"
                className="chip-btn"
                onClick={() => { setSelectedCategory('Makanan Berat'); setActiveTab('explore'); }}
              >
                🍲 Makanan Berat
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => { setSelectedCategory('Minuman & Kopi'); setActiveTab('explore'); }}
              >
                🍧 Minuman Segar
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => { setSelectedCategory('Camilan & Gorengan'); setActiveTab('explore'); }}
              >
                🥟 Camilan Gurih
              </button>
              <button
                type="button"
                className="chip-btn"
                onClick={() => { setActiveTab('ai-rec'); }}
                style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
              >
                ✨ Rekomendasi AI
              </button>
            </div>
          </div>

          <div className="buyer-welcome-visual">
            <img src="/assets/visual-4.webp" alt="Eksplorasi Kuliner" className="buyer-hero-img" />
          </div>
        </div>

        {/* Buyer Navigation Tabs */}
        <div className="buyer-nav-tabs">
          <button
            type="button"
            className={`buyer-tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Jelajahi Semua Kuliner</span>
          </button>

          <button
            type="button"
            className={`buyer-tab-btn ${activeTab === 'ai-rec' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-rec')}
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>Asisten Rekomendasi Menu AI</span>
          </button>

          <button
            type="button"
            className={`buyer-tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <i className="fa-solid fa-heart"></i>
            <span>Menu Favorit Saya ({favorites.length})</span>
          </button>
        </div>

        {/* Tab 1: Explore All Menus & Merchants */}
        {activeTab === 'explore' && (
          <div>
            {/* Filter & Search Bar */}
            <div className="buyer-filter-box">
              <div className="filter-pills">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`filter-btn ${selectedCategory === c.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <select
                  className="city-select-pill"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="all">📍 Semua Kota</option>
                  <option value="Sidoarjo">📍 Sidoarjo</option>
                  <option value="Surabaya">📍 Surabaya</option>
                </select>

                <div className="search-box-wrapper" style={{ minWidth: '240px' }}>
                  <i className="fa-solid fa-magnifying-glass search-icon-inside"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Cari rawon, kupang, es sinom..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Merchant / Menu Display Grid */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '12px' }}></i>
                <p>Mencari UMKM kuliner terbaik...</p>
              </div>
            ) : merchants.length === 0 ? (
              <div className="dash-empty-state">
                <i className="fa-solid fa-utensils"></i>
                <h3>Tidak Ditemukan Menu yang Cocok</h3>
                <p>Coba gunakan kata kunci pencarian yang lain atau ubah filter kategori.</p>
              </div>
            ) : (
              <div className="buyer-food-grid">
                {merchants.map((merchant) => (
                  <div className="buyer-food-card" key={merchant.id}>
                    <div className="food-card-img-wrap">
                      <img
                        src={merchant.image_url || '/assets/visual-1.webp'}
                        alt={merchant.name}
                        className="food-card-img"
                      />
                      <span className="food-cat-pill">{merchant.category_name}</span>
                      <div className="food-rating-pill">
                        <i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i>
                        <span>{merchant.rating || '4.9'}</span>
                      </div>
                    </div>

                    <div className="food-card-content">
                      <div className="merchant-sub-line">
                        <i className="fa-solid fa-store" style={{ color: 'var(--primary)' }}></i>
                        <strong>{merchant.name}</strong>
                      </div>
                      <div className="location-sub-line">
                        <i className="fa-solid fa-location-dot"></i>
                        <span>{merchant.city}{merchant.district ? `, ${merchant.district}` : ''}</span>
                      </div>

                      <p className="food-desc-text">{merchant.description}</p>

                      {merchant.ai_highlight && (
                        <div className="food-ai-note">
                          <i className="fa-solid fa-sparkles"></i>
                          <span>{merchant.ai_highlight}</span>
                        </div>
                      )}

                      {/* Display Menu Items under this merchant */}
                      <div className="merchant-menu-list">
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--navy-dark)', display: 'block', marginBottom: '8px' }}>
                          Pilihan Menu di Lapak Ini:
                        </span>
                        {merchant.menus && merchant.menus.length > 0 ? (
                          merchant.menus.map((m) => {
                            const isFav = favorites.some(f => f.id === m.id);
                            return (
                              <div className="menu-single-item" key={m.id}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                                    {m.name}
                                  </div>
                                  <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: 700 }}>
                                    Rp {m.price?.toLocaleString('id-ID')}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  <button
                                    type="button"
                                    className={`btn-item-fav ${isFav ? 'active' : ''}`}
                                    onClick={() => toggleFavorite({ ...m, merchantName: merchant.name, whatsapp: merchant.whatsapp })}
                                    title="Simpan ke Favorit"
                                  >
                                    <i className={`fa-${isFav ? 'solid' : 'regular'} fa-heart`}></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-item-order"
                                    onClick={() => addToCart(m, merchant)}
                                    title="Tambah ke Pesanan"
                                  >
                                    <i className="fa-solid fa-plus"></i> Pesan
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mulai dari Rp 20.000</div>
                        )}
                      </div>

                      {/* Direct WhatsApp Action */}
                      <div className="food-card-footer">
                        <a
                          href={`https://wa.me/${merchant.whatsapp || merchant.phone?.replace(/\D/g, '')}?text=Halo%20${encodeURIComponent(merchant.name)},%20saya%20tertarik%20dengan%20menu%20di%20Delish%20House.`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-chat-seller-wa"
                        >
                          <i className="fa-brands fa-whatsapp"></i> Chat Penjual Langsung
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: AI Culinary Recommendation Engine */}
        {activeTab === 'ai-rec' && (
          <div className="buyer-ai-tab-box">
            <div className="ai-card-wrapper" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="section-header text-center" style={{ marginBottom: '28px' }}>
                <span className="badge-pill badge-blue">Kecerdasan Buatan Delish House</span>
                <h2 style={{ fontSize: '1.6rem', color: 'var(--navy-dark)', marginTop: '8px' }}>
                  Bingung Mau Makan Apa? Tanya AI Delish! 🤖
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Pilih selera dan anggaranmu, AI akan memindai menu UMKM lokal terlezat di sekitarmu.
                </p>
              </div>

              <div className="ai-grid">
                <form onSubmit={handleRunAiRec} className="ai-form-col">
                  <div className="form-group">
                    <label className="form-label">Berapa Anggaran / Budget Makan?</label>
                    <select
                      className="form-select"
                      value={aiBudget}
                      onChange={(e) => setAiBudget(e.target.value)}
                    >
                      <option value="hemat">Hemat (Di bawah Rp 20.000)</option>
                      <option value="sedang">Sedang (Rp 20.000 - Rp 35.000)</option>
                      <option value="puas">Puas / Bebas (Di atas Rp 35.000)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Suasana Rasa yang Diidamkan</label>
                    <select
                      className="form-select"
                      value={aiMood}
                      onChange={(e) => setAiMood(e.target.value)}
                    >
                      <option value="pedas">🌶️ Pedas Nendang & Bikin Melek</option>
                      <option value="berkuah">🥣 Hangat Berkuah, Gurih & Segar</option>
                      <option value="manis-segar">🍧 Manis Dingin & Pelepas Dahaga</option>
                      <option value="camilan">🥟 Camilan Renyah / Gorengan Sore</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Area / Kota Kamu</label>
                    <select
                      className="form-select"
                      value={aiCity}
                      onChange={(e) => setAiCity(e.target.value)}
                    >
                      <option value="Sidoarjo">Sidoarjo</option>
                      <option value="Surabaya">Surabaya</option>
                      <option value="all">Semua Kota</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isAiLoading}
                    style={{ width: '100%', marginTop: '6px' }}
                  >
                    <i className={`fa-solid ${isAiLoading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                    <span>{isAiLoading ? 'Mencari Rekomendasi...' : 'Dapatkan Rekomendasi Menu'}</span>
                  </button>
                </form>

                {/* AI Rec Results */}
                <div className="ai-result-col">
                  {aiRecResults ? (
                    <div className="ai-result-box">
                      <span className="badge-pill badge-blue" style={{ marginBottom: '10px', display: 'inline-block' }}>
                        Pilihan AI Terpilih
                      </span>
                      <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', marginBottom: '16px' }}>
                        {aiRecResults.summary}
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {aiRecResults.data?.map((item) => (
                          <div
                            key={item.menu_id}
                            style={{
                              background: '#FFFFFF',
                              padding: '14px',
                              borderRadius: '12px',
                              border: '1px solid #E2E8F0',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <strong style={{ fontSize: '0.95rem', color: 'var(--navy-dark)' }}>{item.menu_name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                {item.merchant_name} • {item.city} ⭐ {item.rating}
                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.95rem' }}>
                                Rp {item.price.toLocaleString('id-ID')}
                              </div>
                              <a
                                href={`https://wa.me/${item.whatsapp}?text=Halo%20${encodeURIComponent(item.merchant_name)},%20saya%20ingin%20memesan%20rekomendasi%20menu%20*${encodeURIComponent(item.menu_name)}*%20dari%20Delish%20House.`}
                                target="_blank"
                                rel="noreferrer"
                                className="wa-order-btn"
                                style={{ padding: '6px 12px', fontSize: '0.78rem', marginTop: '4px' }}
                              >
                                <i className="fa-brands fa-whatsapp"></i> Pesan
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="ai-empty-state">
                      <i className="fa-solid fa-utensils ai-empty-icon"></i>
                      <h4>Siap Memberikan Rekomendasi</h4>
                      <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
                        Pilih suasana rasa dan anggaran di sebelah kiri untuk melihat rekomendasi kuliner yang pas buatmu hari ini!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Favorites */}
        {activeTab === 'favorites' && (
          <div className="buyer-favorites-tab">
            <h2 className="dash-sec-title">Menu Favorit Tersimpan</h2>
            <p className="dash-sec-desc">Daftar sajian kuliner yang kamu sukai untuk pemesanan cepat kapan saja.</p>

            {favorites.length === 0 ? (
              <div className="dash-empty-state" style={{ marginTop: '20px' }}>
                <i className="fa-regular fa-heart"></i>
                <h3>Belum Ada Menu Favorit</h3>
                <p>Klik ikon hati pada sajian kuliner di tab "Jelajahi Semua Kuliner" untuk menyimpannya di sini.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ marginTop: '16px' }}
                  onClick={() => setActiveTab('explore')}
                >
                  <i className="fa-solid fa-utensils"></i> Jelajahi Kuliner Sekarang
                </button>
              </div>
            ) : (
              <div className="favorites-list-grid">
                {favorites.map((fav) => (
                  <div className="fav-item-card" key={fav.id}>
                    <div>
                      <h4 style={{ color: 'var(--navy-dark)', fontSize: '1rem', marginBottom: '4px' }}>{fav.name}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lapak: <strong>{fav.merchantName}</strong></div>
                      <div style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem', marginTop: '4px' }}>
                        Rp {fav.price?.toLocaleString('id-ID')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <a
                        href={`https://wa.me/${fav.whatsapp}?text=Halo%20${encodeURIComponent(fav.merchantName)},%20saya%20ingin%20memesan%20menu%20favorit%20*${encodeURIComponent(fav.name)}*%20via%20Delish%20House.`}
                        target="_blank"
                        rel="noreferrer"
                        className="wa-order-btn"
                        style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                      >
                        <i className="fa-brands fa-whatsapp"></i> Pesan
                      </a>
                      <button
                        type="button"
                        className="btn-delete-menu"
                        onClick={() => toggleFavorite(fav)}
                        title="Hapus dari favorit"
                      >
                        <i className="fa-solid fa-trash-can"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cart / Order Modal */}
      {showCartModal && (
        <div className="modal-overlay active" onClick={(e) => { if (e.target.className.includes('modal-overlay')) setShowCartModal(false); }}>
          <div className="modal-card" style={{ maxWidth: '520px' }}>
            <button type="button" className="modal-close-btn" onClick={() => setShowCartModal(false)}>&times;</button>
            <div className="modal-header">
              <div className="modal-badge"><span>Keranjang Pesanan</span></div>
              <h3 className="modal-title">Ringkasan Pesanan Kuliner</h3>
              <p className="modal-subtitle">Pesanan dikirim langsung ke WhatsApp pedagang tanpa potongan komisi.</p>
            </div>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-basket-shopping" style={{ fontSize: '2.5rem', color: '#CBD5E1', marginBottom: '10px' }}></i>
                <p>Keranjang pesanan masih kosong.</p>
              </div>
            ) : (
              <div>
                <div className="cart-merchant-tag">
                  <i className="fa-solid fa-store" style={{ color: 'var(--primary)' }}></i>
                  <span>Lapak: <strong>{cart[0]?.merchant?.name}</strong> ({cart[0]?.merchant?.city})</span>
                </div>

                <div className="cart-items-list">
                  {cart.map((c) => (
                    <div className="cart-item-row" key={c.menu.id}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.menu.name}</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Rp {c.menu.price.toLocaleString('id-ID')}
                        </div>
                      </div>

                      <div className="cart-qty-controls">
                        <button type="button" className="qty-btn" onClick={() => updateQty(c.menu.id, -1)}>-</button>
                        <span className="qty-val">{c.qty}</span>
                        <button type="button" className="qty-btn" onClick={() => updateQty(c.menu.id, 1)}>+</button>
                      </div>

                      <div style={{ fontWeight: 700, minWidth: '80px', textAlign: 'right', color: 'var(--navy-dark)' }}>
                        Rp {(c.menu.price * c.qty).toLocaleString('id-ID')}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(c.menu.id)}
                        style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', marginLeft: '6px' }}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-total-bar">
                  <span>Total Tagihan:</span>
                  <span className="total-val">Rp {totalCartPrice.toLocaleString('id-ID')}</span>
                </div>

                <div className="form-group" style={{ marginTop: '14px' }}>
                  <label className="form-label" style={{ fontSize: '0.85rem' }}>Catatan Pesanan / Alamat Kirim (Opsional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Contoh: Sambal pedas dipisah, kirim ke Jl. Melati No. 4"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary modal-submit-btn"
                  style={{ background: '#25D366', borderColor: '#25D366' }}
                  onClick={handleCheckoutWhatsApp}
                >
                  <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.2rem' }}></i>
                  <span>Kirim Pesanan ke WhatsApp Pedagang</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

