import React, { useState } from 'react';
import { apiService } from '../services/api';

export default function AiToolsSection({ onShowToast }) {
  const [activeTab, setActiveTab] = useState('copywriter');

  // Copywriter State
  const [foodName, setFoodName] = useState('Ayam Bakar Madu Pedas');
  const [ingredients, setIngredients] = useState('madu hutan murni, sambal bajak, rempah lengkuas');
  const [tone, setTone] = useState('appetizing');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [copyResult, setCopyResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Recommendation State
  const [budget, setBudget] = useState('hemat');
  const [mood, setMood] = useState('pedas');
  const [city, setCity] = useState('Sidoarjo');
  const [isGeneratingRec, setIsGeneratingRec] = useState(false);
  const [recResult, setRecResult] = useState(null);

  // Handle Copywriter Submit
  const handleGenerateCopy = async (e) => {
    e.preventDefault();
    if (!foodName.trim()) {
      onShowToast('Silakan masukkan nama produk kuliner.');
      return;
    }

    setIsGeneratingCopy(true);
    setCopied(false);
    try {
      const res = await apiService.generateCopywriter({
        productName: foodName,
        keyIngredients: ingredients,
        tone
      });
      if (res.success) {
        setCopyResult(res.data);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Gagal memproses AI Copywriter.');
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  // Copy to clipboard
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Deskripsi berhasil disalin ke clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  // Handle Recommendation Submit
  const handleGenerateRec = async (e) => {
    e.preventDefault();
    setIsGeneratingRec(true);
    try {
      const res = await apiService.getAiRecommendations({ budget, mood, city });
      if (res.success) {
        setRecResult(res);
      }
    } catch (err) {
      console.error(err);
      onShowToast('Gagal memproses rekomendasi AI.');
    } finally {
      setIsGeneratingRec(false);
    }
  };

  return (
    <section className="ai-interactive-section" id="ai-tools">
      <div className="container">
        <div className="section-header text-center">
          <div className="badge-pill badge-blue section-badge">
            <span>TEKNOLOGI AI DELISH HOUSE</span>
          </div>
          <h2 className="section-title">
            Coba Langsung <span className="text-orange">Kecerdasan Buatan</span> Kami
          </h2>
          <p className="section-subtitle">
            Rasakan langsung bagaimana kecerdasan buatan Delish House membantu pedagang UMKM membuat promosi otomatis dan membantu konsumen menemukan kuliner favorit.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="ai-tabs">
          <button
            type="button"
            className={`ai-tab-btn ${activeTab === 'copywriter' ? 'active' : ''}`}
            onClick={() => setActiveTab('copywriter')}
          >
            <i className="fa-solid fa-wand-magic-sparkles"></i>
            <span>AI Copywriter Kuliner</span>
          </button>
          <button
            type="button"
            className={`ai-tab-btn ${activeTab === 'recommendation' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendation')}
          >
            <i className="fa-solid fa-compass"></i>
            <span>AI Smart Recommendation</span>
          </button>
        </div>

        {/* Tab 1: AI Copywriter */}
        {activeTab === 'copywriter' && (
          <div className="ai-card-wrapper">
            <div className="ai-grid">
              {/* Form Input */}
              <form onSubmit={handleGenerateCopy} className="ai-form-col">
                <div className="form-group">
                  <label className="form-label">Nama Menu / Produk Kuliner</label>
                  <input
                    type="text"
                    className="form-input"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="Contoh: Bebek Goreng Sambal Korek"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bahan Utama / Ciri Khas (Opsional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="Contoh: rempah lengkuas, daging empuk, pedas gurih"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gaya Penulisan (Tone of Voice)</label>
                  <select
                    className="form-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="appetizing">Menggugah Selera (Sensual & Gurih)</option>
                    <option value="promo">Promo & Diskon Terbatas (Mendesak)</option>
                    <option value="casual">Santai & Gaul (Anak Muda/Nongkrong)</option>
                    <option value="storytelling">Resep Warisan (Autentik & Tradisional)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isGeneratingCopy}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <i className={`fa-solid ${isGeneratingCopy ? 'fa-spinner fa-spin' : 'fa-bolt'}`}></i>
                  <span>{isGeneratingCopy ? 'Sedang Meracik Teks AI...' : 'Buat Deskripsi AI Sekarang'}</span>
                </button>
              </form>

              {/* Output Result */}
              <div className="ai-result-col">
                {copyResult ? (
                  <div className="ai-result-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="ai-tag">Hasil AI Delish</span>
                      <button
                        type="button"
                        className={`copy-btn ${copied ? 'copied' : ''}`}
                        onClick={() => handleCopyText(`${copyResult.title}\n\n${copyResult.description}\n\n${copyResult.instagramCaption}`)}
                      >
                        <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                        <span>{copied ? 'Tersalin!' : 'Salin Semua'}</span>
                      </button>
                    </div>

                    <h4 className="ai-result-title">{copyResult.title}</h4>
                    <p className="ai-result-text">{copyResult.description}</p>

                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '12px', marginTop: '12px' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--navy-dark)' }}>Caption Instagram / WhatsApp:</strong>
                      <p className="ai-result-text" style={{ fontSize: '0.88rem', marginTop: '6px' }}>
                        {copyResult.instagramCaption}
                      </p>
                    </div>

                    <div className="ai-tag-pills">
                      {copyResult.hashtags?.map((tag, i) => (
                        <span key={i} className="ai-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="ai-empty-state">
                    <div className="ai-empty-icon">
                      <i className="fa-solid fa-pen-nib"></i>
                    </div>
                    <h4>Hasil AI Belum Dibuat</h4>
                    <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
                      Tekan tombol <strong>"Buat Deskripsi AI Sekarang"</strong> untuk melihat keajaiban copywriting kuliner otomatis!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: AI Recommendation */}
        {activeTab === 'recommendation' && (
          <div className="ai-card-wrapper">
            <div className="ai-grid">
              {/* Form Input */}
              <form onSubmit={handleGenerateRec} className="ai-form-col">
                <div className="form-group">
                  <label className="form-label">Berapa Anggaran / Budget Kamu?</label>
                  <select
                    className="form-select"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    <option value="hemat">Hemat (Di bawah Rp 20.000)</option>
                    <option value="sedang">Sedang (Rp 20.000 - Rp 35.000)</option>
                    <option value="puas">Puas / Bebas (Di atas Rp 35.000)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Suasana Rasa yang Diinginkan</label>
                  <select
                    className="form-select"
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                  >
                    <option value="pedas">Pedas Nendang & Berani 🌶️</option>
                    <option value="berkuah">Hangat Berkuah & Segar Gurih 🥣</option>
                    <option value="manis-segar">Manis Dingin & Pelepas Dahaga 🍧</option>
                    <option value="camilan">Camilan Santai / Gorengan 🥟</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Lokasi / Kota</label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="Sidoarjo">Sidoarjo</option>
                    <option value="Surabaya">Surabaya</option>
                    <option value="all">Semua Kota</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isGeneratingRec}
                  style={{ width: '100%', marginTop: '8px' }}
                >
                  <i className={`fa-solid ${isGeneratingRec ? 'fa-spinner fa-spin' : 'fa-magnifying-glass'}`}></i>
                  <span>{isGeneratingRec ? 'Mencari Rekomendasi...' : 'Dapatkan Rekomendasi Menu'}</span>
                </button>
              </form>

              {/* Output Result */}
              <div className="ai-result-col">
                {recResult ? (
                  <div className="ai-result-box">
                    <span className="ai-tag" style={{ marginBottom: '10px', display: 'inline-block' }}>
                      Rekomendasi AI
                    </span>
                    <p style={{ fontSize: '0.9rem', marginBottom: '16px', color: 'var(--text-body)' }}>
                      {recResult.summary}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {recResult.data?.map((item) => (
                        <div
                          key={item.menu_id}
                          style={{
                            background: '#FFFFFF',
                            padding: '12px 14px',
                            borderRadius: '12px',
                            border: '1px solid #E2E8F0',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <strong style={{ fontSize: '0.92rem', color: 'var(--navy-dark)' }}>
                              {item.menu_name}
                            </strong>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {item.merchant_name} • {item.city} ⭐ {item.rating}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.92rem' }}>
                              Rp {item.price.toLocaleString('id-ID')}
                            </div>
                            <a
                              href={`https://wa.me/${item.whatsapp}?text=Halo%20${encodeURIComponent(item.merchant_name)},%20saya%20tertarik%20dengan%20menu%20${encodeURIComponent(item.menu_name)}%20di%20Delish%20House.`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: '0.75rem',
                                color: '#16A34A',
                                fontWeight: 600,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              <i className="fa-brands fa-whatsapp"></i> Chat
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="ai-empty-state">
                    <div className="ai-empty-icon">
                      <i className="fa-solid fa-utensils"></i>
                    </div>
                    <h4>Belum Ada Pilihan Rekomendasi</h4>
                    <p style={{ fontSize: '0.9rem', marginTop: '6px' }}>
                      Atur anggaran dan suasana rasa di sebelah kiri, lalu tekan <strong>"Dapatkan Rekomendasi Menu"</strong>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
