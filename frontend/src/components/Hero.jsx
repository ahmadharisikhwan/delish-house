import React from 'react';

export default function Hero({ onOpenRegister, onExplore }) {
  return (
    <section className="hero-section" id="beranda">
      <div className="container hero-container">
        <div className="hero-content">
          {/* Platform Badge */}
          <div className="badge-pill badge-blue">
            <span>Platform UMKM Kuliner | Delish House (React.js Edition)</span>
          </div>

          {/* Main Hero Heading */}
          <h1 className="hero-title">
            Dukung UMKM<br />
            Kuliner Lokal,<br />
            Lebih Dekat,<br />
            <span className="text-orange">Lebih Mudah</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            Delish House adalah platform web modern berbasis React.js yang membantu pedagang UMKM mikro menampilkan produk kuliner mereka dengan mudah, dilengkapi AI untuk deskripsi produk, rekomendasi menu, katalog interaktif, dan komunikasi langsung dengan pelanggan.
          </p>

          {/* Action Buttons */}
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary hero-btn-main"
              onClick={onExplore}
            >
              <i className="fa-solid fa-utensils"></i>
              <span>Jelajahi Kuliner Lokal</span>
            </button>
            <button
              type="button"
              className="btn btn-outline hero-btn-secondary"
              id="btnHeroRegister"
              onClick={onOpenRegister}
            >
              <i className="fa-solid fa-store"></i>
              <span>Daftarkan Usaha Saya</span>
            </button>
          </div>

          {/* Trust Badges List */}
          <ul className="hero-checklist">
            <li className="checklist-item">
              <span className="check-circle"><i className="fa-solid fa-check"></i></span>
              <span>Gratis untuk mulai</span>
            </li>
            <li className="checklist-item">
              <span className="check-circle"><i className="fa-solid fa-check"></i></span>
              <span>Mudah digunakan</span>
            </li>
            <li className="checklist-item">
              <span className="check-circle"><i className="fa-solid fa-check"></i></span>
              <span>Dibuat untuk UMKM</span>
            </li>
          </ul>
        </div>

        {/* Hero Visual Graphic */}
        <div className="hero-visual">
          <div className="visual-img-wrapper">
            <img
              src="/assets/visual-1.webp"
              alt="Dukungan UMKM Kuliner Lokal Naik Kelas Bersama Teknologi"
              className="hero-visual-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
