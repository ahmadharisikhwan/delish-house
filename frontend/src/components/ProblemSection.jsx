import React from 'react';

const problems = [
  {
    icon: '/assets/icons/icon-1.webp',
    title: 'Promosi Terbatas',
    desc: 'Banyak UMKM masih mengandalkan promosi dari mulut ke mulut.'
  },
  {
    icon: '/assets/icons/icon-2.webp',
    title: 'Informasi Tidak Lengkap',
    desc: 'Foto, menu, harga, dan lokasi belum tersaji dengan jelas.'
  },
  {
    icon: '/assets/icons/icon-3.webp',
    title: 'Sulit Ditemukan',
    desc: 'Pelanggan kesulitan mencari UMKM di sekitar lokasi mereka.'
  },
  {
    icon: '/assets/icons/icon-4.webp',
    title: 'Komunikasi Terpisah',
    desc: 'Pembeli dan pedagang harus berkomunikasi melalui banyak media.'
  }
];

export default function ProblemSection() {
  return (
    <section className="section problem-section" id="masalah">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill badge-blue section-badge">
            <span>MASALAH YANG KAMI LIHAT</span>
          </div>
          <h2 className="section-title">
            Banyak UMKM Kuliner Hebat,<br />
            Tapi Masih <span className="text-orange">Sulit Ditemukan</span>
          </h2>
          <p className="section-subtitle">
            Banyak pedagang kuliner mikro memiliki produk yang lezat, namun terkendala promosi, informasi yang tidak terstruktur, dan terbatasnya jangkauan pelanggan.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="problem-grid">
          {problems.map((prob, idx) => (
            <div className="problem-card" key={idx}>
              <div className="problem-icon-wrapper">
                <img src={prob.icon} alt={prob.title} className="problem-icon" />
              </div>
              <h3 className="problem-card-title">{prob.title}</h3>
              <p className="problem-card-desc">{prob.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
