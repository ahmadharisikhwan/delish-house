import React from 'react';

export default function CtaBanner({ onOpenRegister, onExplore }) {
  return (
    <section className="cta-banner-section" id="cta">
      <div className="container cta-container">
        <div className="cta-card">
          {/* Left Visual */}
          <div className="cta-visual cta-visual-left">
            <img
              src="/assets/visual-3.webp"
              alt="Kuliner Lokal Punya Masa Depan Cerah!"
              className="cta-img cta-img-left"
            />
          </div>

          {/* Center Content */}
          <div className="cta-content">
            <h2 className="cta-title">
              Siap Memulai Perjalanan<br />
              Bersama Delish House?
            </h2>
            <p className="cta-subtitle">
              Daftarkan usaha kulinermu sekarang dan rasakan kemudahan promosi dengan dukungan AI.
            </p>
            <div className="cta-actions">
              <button
                type="button"
                className="btn btn-primary cta-btn-primary"
                id="btnCtaRegister"
                onClick={onOpenRegister}
              >
                <span>Daftar Gratis</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button
                type="button"
                className="btn btn-outline cta-btn-secondary"
                id="btnCtaExplore"
                onClick={onExplore}
              >
                <span>Jelajahi Sekarang</span>
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="cta-visual cta-visual-right">
            <img
              src="/assets/visual-4.webp"
              alt="Temukan Kuliner Enak di Sekitarmu!"
              className="cta-img cta-img-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
