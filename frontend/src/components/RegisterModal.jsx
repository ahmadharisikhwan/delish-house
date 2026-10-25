import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function RegisterModal({ isOpen, onClose, onLoginSuccess, onShowToast }) {
  const [role, setRole] = useState('buyer'); // 'buyer' | 'seller'
  const [loading, setLoading] = useState(false);

  // Form Seller State
  const [sellerForm, setSellerForm] = useState({
    vendorName: '',
    ownerName: '',
    vendorCategory: 'Makanan Berat',
    vendorCity: 'Sidoarjo',
    vendorPhone: '',
    address: ''
  });

  // Form Buyer State
  const [buyerForm, setBuyerForm] = useState({
    name: '',
    phone: '',
    city: 'Sidoarjo',
    preference: 'pedas'
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Handle Seller Submit
  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    if (!sellerForm.vendorName || !sellerForm.vendorPhone) {
      onShowToast('Mohon lengkapi nama usaha dan nomor WhatsApp.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.registerPartnership(sellerForm);
      if (res.success) {
        onShowToast(res.message || 'Pendaftaran toko berhasil!');
        onLoginSuccess({
          role: 'seller',
          id: res.data?.id || 1,
          merchantId: res.data?.id || 1,
          name: sellerForm.vendorName,
          ownerName: sellerForm.ownerName || 'Mitra Penjual',
          category_name: sellerForm.vendorCategory,
          city: sellerForm.vendorCity,
          phone: sellerForm.vendorPhone,
          whatsapp: sellerForm.vendorPhone.replace(/\D/g, ''),
          address: sellerForm.address || `Jl. Utama, ${sellerForm.vendorCity}`
        });
        onClose();
      }
    } catch (err) {
      console.error(err);
      onShowToast('Gagal memproses pendaftaran.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Buyer Submit
  const handleBuyerSubmit = (e) => {
    e.preventDefault();
    if (!buyerForm.name) {
      onShowToast('Mohon masukkan nama Anda.');
      return;
    }

    onShowToast(`Selamat datang di Delish House, ${buyerForm.name}! 🎉`);
    onLoginSuccess({
      role: 'buyer',
      name: buyerForm.name,
      phone: buyerForm.phone || '081234567890',
      city: buyerForm.city,
      preference: buyerForm.preference
    });
    onClose();
  };

  // Quick Demo Logins
  const handleDemoSeller = () => {
    onShowToast('Masuk sebagai Penjual Demo: Kupang Lontong Pak Misari (Sidoarjo) 🏪');
    onLoginSuccess({
      role: 'seller',
      id: 1,
      merchantId: 1,
      name: 'Kupang Lontong Pak Misari',
      ownerName: 'Bapak Misari',
      category_name: 'Makanan Berat',
      city: 'Sidoarjo',
      phone: '081234567890',
      whatsapp: '6281234567890',
      address: 'Jl. Mojopahit No. 25, Sidokumpul, Sidoarjo'
    });
    onClose();
  };

  const handleDemoBuyer = () => {
    onShowToast('Masuk sebagai Pembeli Demo: Rian Syahputra (Pencinta Kuliner Sidoarjo) 🛍️');
    onLoginSuccess({
      role: 'buyer',
      name: 'Rian Syahputra',
      phone: '081234567811',
      city: 'Sidoarjo',
      preference: 'pedas'
    });
    onClose();
  };

  return (
    <div
      className={`modal-overlay ${isOpen ? 'active' : ''}`}
      id="registerModal"
      onClick={(e) => {
        if (e.target.id === 'registerModal') onClose();
      }}
    >
      <div className="modal-card" style={{ maxWidth: '560px' }}>
        <button
          type="button"
          className="modal-close-btn"
          id="modalCloseBtn"
          aria-label="Tutup Modal"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="modal-header">
          <div className="modal-badge">
            <span>Mulai Gratis / Masuk</span>
          </div>
          <h3 className="modal-title">Pilih Peran Anda</h3>
          <p className="modal-subtitle">Apakah Anda ingin berjualan kuliner atau mencari santapan lezat?</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="auth-role-tabs">
          <button
            type="button"
            className={`auth-role-tab ${role === 'buyer' ? 'active buyer' : ''}`}
            onClick={() => setRole('buyer')}
          >
            <i className="fa-solid fa-basket-shopping"></i>
            <div>
              <strong>Saya Pembeli</strong>
              <span>Cari & Pesan Kuliner</span>
            </div>
          </button>

          <button
            type="button"
            className={`auth-role-tab ${role === 'seller' ? 'active seller' : ''}`}
            onClick={() => setRole('seller')}
          >
            <i className="fa-solid fa-store"></i>
            <div>
              <strong>Saya Penjual</strong>
              <span>Buka Lapak UMKM</span>
            </div>
          </button>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="demo-login-box">
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
            ⚡ Akses Cepat untuk Uji Coba (Tanpa Isi Form):
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {role === 'buyer' ? (
              <button
                type="button"
                className="btn-demo-quick btn-demo-buyer"
                onClick={handleDemoBuyer}
              >
                <i className="fa-solid fa-user"></i> Masuk Cepat sebagai Pembeli Demo
              </button>
            ) : (
              <button
                type="button"
                className="btn-demo-quick btn-demo-seller"
                onClick={handleDemoSeller}
              >
                <i className="fa-solid fa-store"></i> Masuk Cepat sebagai Penjual Demo
              </button>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '14px 0', position: 'relative' }}>
          <hr style={{ borderColor: '#E2E8F0', borderStyle: 'solid', borderWidth: '0.5px' }} />
          <span style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: '#FFFFFF', padding: '0 12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            atau isi form di bawah
          </span>
        </div>

        {/* Form Pembeli */}
        {role === 'buyer' && (
          <form className="modal-form" onSubmit={handleBuyerSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Lengkap</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Rian Syahputra"
                required
                value={buyerForm.name}
                onChange={(e) => setBuyerForm({ ...buyerForm, name: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Kota / Lokasi Kamu</label>
                <select
                  className="form-select"
                  value={buyerForm.city}
                  onChange={(e) => setBuyerForm({ ...buyerForm, city: e.target.value })}
                >
                  <option value="Sidoarjo">Sidoarjo</option>
                  <option value="Surabaya">Surabaya</option>
                  <option value="Gresik">Gresik</option>
                  <option value="Lainnya">Kota Lainnya</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nomor WhatsApp</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="08xxxxxxxxxx"
                  value={buyerForm.phone}
                  onChange={(e) => setBuyerForm({ ...buyerForm, phone: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary modal-submit-btn" style={{ background: '#2563EB', borderColor: '#2563EB' }}>
              <i className="fa-solid fa-utensils"></i>
              <span>Masuk ke Halaman Pembeli</span>
            </button>
          </form>
        )}

        {/* Form Penjual */}
        {role === 'seller' && (
          <form className="modal-form" onSubmit={handleSellerSubmit}>
            <div className="form-group">
              <label className="form-label">Nama Usaha / Lapak Kuliner</label>
              <input
                type="text"
                className="form-input"
                placeholder="Contoh: Bakso Mercon Mas Joko"
                required
                value={sellerForm.vendorName}
                onChange={(e) => setSellerForm({ ...sellerForm, vendorName: e.target.value })}
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Nama Pemilik</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Bapak Joko"
                  value={sellerForm.ownerName}
                  onChange={(e) => setSellerForm({ ...sellerForm, ownerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Kategori Kuliner</label>
                <select
                  className="form-select"
                  value={sellerForm.vendorCategory}
                  onChange={(e) => setSellerForm({ ...sellerForm, vendorCategory: e.target.value })}
                >
                  <option value="Makanan Berat">Makanan Berat (Nasi, Mie, Bakso)</option>
                  <option value="Minuman & Kopi">Minuman & Kopi</option>
                  <option value="Camilan & Gorengan">Camilan & Gorengan</option>
                  <option value="Dessert & Manisan">Dessert & Kue Tradisional</option>
                </select>
              </div>
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Kota / Lokasi Usaha</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Sidoarjo"
                  required
                  value={sellerForm.vendorCity}
                  onChange={(e) => setSellerForm({ ...sellerForm, vendorCity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor WhatsApp Usaha</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="08xxxxxxxxxx"
                  required
                  value={sellerForm.vendorPhone}
                  onChange={(e) => setSellerForm({ ...sellerForm, vendorPhone: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary modal-submit-btn"
              disabled={loading}
            >
              <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-store'}`}></i>
              <span>{loading ? 'Mendaftarkan Lapak...' : 'Buka Lapak di Dashboard Penjual'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
