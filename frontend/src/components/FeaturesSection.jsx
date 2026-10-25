import React from 'react';

const features = [
  {
    icon: '/assets/icons/icon-5.webp',
    title: 'Profil Usaha',
    desc: 'Daftarkan usaha, unggah foto produk, aturlah menu, harga, dan lokasi dengan mudah.'
  },
  {
    icon: '/assets/icons/icon-6.webp',
    title: 'AI Copywriter',
    desc: 'Buat deskripsi produk yang menarik dan profesional secara otomatis dengan AI.'
  },
  {
    icon: '/assets/icons/icon-7.webp',
    title: 'Rekomendasi Menu',
    desc: 'AI membantu pelanggan menemukan menu sesuai selera, anggaran, dan lokasi mereka.'
  },
  {
    icon: '/assets/icons/icon-8.webp',
    title: 'Peta Lokasi',
    desc: 'Tampilkan lokasi usaha di peta interaktif, mudah ditemukan pelanggan terdekat.'
  },
  {
    icon: '/assets/icons/icon-9.webp',
    title: 'Direct Chat',
    desc: 'Terhubung langsung dengan pelanggan melalui chat ke CS pedagang tanpa komisi.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="section features-section" id="fitur">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill badge-blue section-badge">
            <span>FITUR UNGGULAN</span>
          </div>
          <h2 className="section-title">
            Semua yang UMKM Kuliner Butuhkan,<br />
            Dalam Satu Platform
          </h2>
        </div>

        {/* 5 Feature Cards Grid */}
        <div className="features-grid">
          {features.map((feat, idx) => (
            <div className="feature-card" key={idx}>
              <div className="feature-icon-wrapper">
                <img src={feat.icon} alt={feat.title} className="feature-icon" />
              </div>
              <h3 className="feature-card-title">{feat.title}</h3>
              <p className="feature-card-desc">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
