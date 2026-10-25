import React from 'react';

export default function SolutionSection({ onOpenRegister, onScrollToFeatures }) {
  return (
    <section className="section solution-section" id="solusi">
      <div className="container solution-container">
        {/* Solution Text */}
        <div className="solution-content">
          <div className="badge-pill badge-blue section-badge">
            <span>SOLUSI KAMI</span>
          </div>
          <h2 className="section-title solution-title">
            Delish House<br />
            Platform UMKM Kuliner<br />
            <span className="text-orange">Berbasis AI</span>
          </h2>
          <p className="solution-description">
            Kami menghadirkan platform web yang sederhana, modern, dan mudah digunakan untuk membantu pedagang kuliner mikro memperkenalkan produknya, menjangkau lebih banyak pelanggan, serta memanfaatkan teknologi AI untuk berkembang.
          </p>
          <div className="solution-actions">
            <button
              type="button"
              className="btn btn-primary"
              id="btnSolutionStart"
              onClick={onOpenRegister}
            >
              <span>Mulai Sekarang</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
            <button
              type="button"
              className="btn btn-outline"
              id="btnSolutionSample"
              onClick={onScrollToFeatures}
            >
              <span>Lihat Contoh</span>
            </button>
          </div>
        </div>

        {/* Solution Mockup Visual with sparkles */}
        <div className="solution-visual">
          <svg className="sparkle-svg sparkle-top-right" width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="#FFA31A" />
          </svg>
          <svg className="sparkle-svg sparkle-bottom-left" width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="#FFA31A" />
          </svg>
          <svg className="sparkle-svg sparkle-middle-left" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="#FFA31A" />
          </svg>
          <svg className="sparkle-svg sparkle-bottom-right" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" fill="#FFA31A" />
          </svg>
          <div className="visual-img-wrapper solution-img-wrapper">
            <img
              src="/assets/visual-2.webp"
              alt="Delish House Platform UMKM Kuliner Berbasis AI Mockup"
              className="solution-visual-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
