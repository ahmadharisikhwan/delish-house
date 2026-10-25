import React from 'react';

export default function WorkflowSection() {
  return (
    <section className="section workflow-section" id="cara-kerja">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill badge-blue section-badge">
            <span>CARA KERJA</span>
          </div>
          <h2 className="section-title">
            Mudah Digunakan, Dalam 3 Langkah Saja
          </h2>
        </div>

        {/* 3 Workflow Steps */}
        <div className="workflow-steps">
          {/* Step 1 */}
          <div className="workflow-step-card">
            <div className="step-illustration-wrapper">
              <img src="/assets/icons/icon-10.webp" alt="Daftarkan Usaha" className="step-illustration" />
            </div>
            <div className="step-indicator">
              <span className="step-number">1</span>
              <h3 className="step-title">Daftarkan Usaha</h3>
            </div>
            <p className="step-desc">
              Buat profil usaha dan unggah produk kulinermu.
            </p>
          </div>

          {/* Step Arrow 1 */}
          <div className="workflow-arrow" aria-hidden="true">
            <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12H44M44 12L34 2M44 12L34 22" stroke="#FF8A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Step 2 */}
          <div className="workflow-step-card">
            <div className="step-illustration-wrapper">
              <img src="/assets/icons/icon-11.webp" alt="Optimalkan dengan AI" className="step-illustration" />
            </div>
            <div className="step-indicator">
              <span className="step-number">2</span>
              <h3 className="step-title">Optimalkan dengan AI</h3>
            </div>
            <p className="step-desc">
              Gunakan AI untuk membuat deskripsi produk yang menarik.
            </p>
          </div>

          {/* Step Arrow 2 */}
          <div className="workflow-arrow" aria-hidden="true">
            <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12H44M44 12L34 2M44 12L34 22" stroke="#FF8A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Step 3 */}
          <div className="workflow-step-card">
            <div className="step-illustration-wrapper">
              <img src="/assets/icons/icon-12.webp" alt="Jangkau Lebih Banyak Pelanggan" className="step-illustration" />
            </div>
            <div className="step-indicator">
              <span className="step-number">3</span>
              <h3 className="step-title">Jangkau Lebih Banyak Pelanggan</h3>
            </div>
            <p className="step-desc">
              Produkmu lebih mudah ditemukan dan pelanggan bisa langsung chat.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
