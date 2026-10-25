import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const categories = [
  { id: 'all', label: 'Semua Menu' },
  { id: 'Makanan Berat', label: 'Makanan Berat' },
  { id: 'Minuman & Kopi', label: 'Minuman & Kopi' },
  { id: 'Camilan & Gorengan', label: 'Camilan' },
  { id: 'Dessert & Manisan', label: 'Dessert' }
];

export default function MerchantCatalog() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMerchants();
  }, [selectedCategory, searchQuery]);

  const loadMerchants = async () => {
    setLoading(true);
    try {
      const data = await apiService.getMerchants({
        category: selectedCategory,
        q: searchQuery
      });
      setMerchants(data);
    } catch (err) {
      console.error('Failed to load merchants:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="catalog-section" id="katalog">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill badge-blue section-badge">
            <span>KATALOG UMKM KULINER</span>
          </div>
          <h2 className="section-title">
            Eksplorasi Kuliner <span className="text-orange">Lokal Terbaik</span>
          </h2>
          <p className="section-subtitle">
            Dukung pedagang mikro lokal di sekitarmu. Hubungi dan pesan langsung ke pedagang tanpa potongan komisi.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="catalog-filters">
          <div className="filter-pills">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="search-box-wrapper">
            <i className="fa-solid fa-magnifying-glass search-icon-inside"></i>
            <input
              type="text"
              className="search-input"
              placeholder="Cari menu, bebek, rawon, sinom..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary)', marginBottom: '12px' }}></i>
            <p>Memuat katalog kuliner dari database...</p>
          </div>
        ) : merchants.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-utensils" style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#CBD5E1' }}></i>
            <p>Tidak ada UMKM kuliner yang cocok dengan pencarian Anda.</p>
          </div>
        ) : (
          <div className="merchant-grid">
            {merchants.map((m) => (
              <div className="merchant-card" key={m.id}>
                <div className="merchant-card-img-wrap">
                  <img
                    src={m.image_url || '/assets/visual-1.webp'}
                    alt={m.name}
                    className="merchant-card-img"
                    loading="lazy"
                  />
                  <div className="merchant-card-badge">
                    {m.category_name}
                  </div>
                  <div className="merchant-card-rating">
                    <i className="fa-solid fa-star" style={{ color: '#F59E0B' }}></i>
                    <span>{m.rating || '4.9'}</span>
                    <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>({m.reviews_count || 100})</span>
                  </div>
                </div>

                <div className="merchant-card-body">
                  <h3 className="merchant-card-title">{m.name}</h3>
                  <div className="merchant-card-location">
                    <i className="fa-solid fa-location-dot" style={{ color: 'var(--primary)' }}></i>
                    <span>{m.city}{m.district ? `, ${m.district}` : ''}</span>
                  </div>
                  <p className="merchant-card-desc">{m.description}</p>

                  {m.ai_highlight && (
                    <div className="merchant-ai-highlight">
                      <i className="fa-solid fa-sparkles" style={{ marginRight: '6px' }}></i>
                      <strong>Sorotan AI:</strong> {m.ai_highlight}
                    </div>
                  )}

                  <div className="merchant-card-footer">
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Mulai dari</span>
                      <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>
                        {m.menus && m.menus[0] ? `Rp ${m.menus[0].price.toLocaleString('id-ID')}` : 'Rp 15.000'}
                      </strong>
                    </div>

                    <a
                      href={`https://wa.me/${m.whatsapp}?text=Halo%20${encodeURIComponent(m.name)},%20saya%20melihat%20usaha%20Anda%20di%20Delish%20House%20dan%20ingin%20memesan.`}
                      target="_blank"
                      rel="noreferrer"
                      className="wa-order-btn"
                    >
                      <i className="fa-brands fa-whatsapp"></i>
                      <span>Chat Pedagang</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
