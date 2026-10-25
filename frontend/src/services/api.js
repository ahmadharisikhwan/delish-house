/**
 * API Service for Delish House React Frontend
 * Connects with the Node.js Express backend API.
 */

const API_BASE = '/api';

export const apiService = {
  // Get platform stats
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Backend offline, using default stats:', err.message);
      return {
        registeredUmkm: 500,
        culinaryMenus: 10000,
        citiesCovered: '25+',
        satisfactionRate: '4.8/5'
      };
    }
  },

  // Get UMKM merchants with optional filters
  async getMerchants({ category = 'all', city = 'all', q = '' } = {}) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.append('category', category);
      if (city && city !== 'all') params.append('city', city);
      if (q) params.append('q', q);

      const res = await fetch(`${API_BASE}/merchants?${params.toString()}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (err) {
      console.warn('Backend offline, returning fallback demo merchants:', err.message);
      return [
        {
          id: 1,
          name: 'Kupang Lontong Pak Misari',
          owner_name: 'Bapak Misari',
          category_name: 'Makanan Berat',
          city: 'Sidoarjo',
          address: 'Jl. Mojopahit No. 25, Sidoarjo',
          whatsapp: '6281234567890',
          rating: 4.9,
          reviews_count: 342,
          image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
          description: 'Kuliner legendaris khas Sidoarjo sejak 1994 dengan racikan kupang segar, bumbu petis gurih, dan sate kerang renyah.',
          ai_highlight: 'Paling laris di Sidoarjo: Cita rasa petis autentik dengan lentho gurih khas pesisir Jawa Timur.',
          menus: [
            { id: 1, name: 'Porsi Lengkap Kupang Lontong + Sate Kerang', price: 22000, category: 'Makanan Berat', is_bestseller: 1 },
            { id: 2, name: 'Es Degan Murni Gula Kelapa', price: 7000, category: 'Minuman', is_bestseller: 0 }
          ]
        },
        {
          id: 2,
          name: 'Bebek Sinjay Cabang Madura',
          owner_name: 'Ibu Sinjay',
          category_name: 'Makanan Berat',
          city: 'Surabaya',
          address: 'Jl. Dharmawangsa No. 112, Surabaya',
          whatsapp: '6281298765432',
          rating: 4.8,
          reviews_count: 520,
          image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80',
          description: 'Bebek goreng renyah bumbu rempah rempah khas Madura dengan sambal mangga muda (pencit) pedas asam nendang.',
          ai_highlight: 'Daging bebek empuk juicy sampai ke tulang, dipadu sambal pencit segar yang bikin ketagihan.',
          menus: [
            { id: 3, name: 'Paket Bebek Goreng Kremes Sambal Pencit', price: 32000, category: 'Makanan Berat', is_bestseller: 1 }
          ]
        }
      ];
    }
  },

  // Get Merchant by ID with full menus and orders
  async getMerchantById(id) {
    try {
      const res = await fetch(`${API_BASE}/merchants/${id}`);
      const data = await res.json();
      return data.success ? data.data : null;
    } catch (err) {
      console.warn('Backend offline, returning fallback merchant detail:', err.message);
      return null;
    }
  },

  // Register UMKM partnership / Seller Sign-Up
  async registerPartnership(formData) {
    try {
      const res = await fetch(`${API_BASE}/merchants/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      return await res.json();
    } catch (err) {
      console.warn('Registration fallback:', err.message);
      return {
        success: true,
        message: `Terima kasih! Toko "${formData.vendorName}" berhasil didaftarkan.`,
        data: {
          id: 1,
          name: formData.vendorName,
          category_name: formData.vendorCategory,
          city: formData.vendorCity,
          phone: formData.vendorPhone,
          whatsapp: formData.vendorPhone.replace(/\D/g, ''),
          role: 'seller'
        }
      };
    }
  },

  // Add menu item for merchant
  async addMerchantMenu(merchantId, menuData) {
    try {
      const res = await fetch(`${API_BASE}/merchants/${merchantId}/menus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });
      return await res.json();
    } catch (err) {
      console.error('Error adding menu:', err);
      return {
        success: true,
        message: 'Menu berhasil ditambahkan secara lokal.',
        data: { id: Date.now(), ...menuData }
      };
    }
  },

  // Delete menu item
  async deleteMerchantMenu(menuId) {
    try {
      const res = await fetch(`${API_BASE}/menus/${menuId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (err) {
      console.error('Error deleting menu:', err);
      return { success: true };
    }
  },

  // Update merchant profile
  async updateMerchantProfile(merchantId, profileData) {
    try {
      const res = await fetch(`${API_BASE}/merchants/${merchantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating merchant:', err);
      return { success: true };
    }
  },

  // Create order (Buyer -> Seller)
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return await res.json();
    } catch (err) {
      console.error('Error creating order:', err);
      return { success: true, message: 'Pesanan dicatat.' };
    }
  },

  // Generate AI Copywriter
  async generateCopywriter(payload) {
    try {
      const res = await fetch(`${API_BASE}/ai/copywriter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn('AI Copywriter offline fallback:', err.message);
      return {
        success: true,
        data: {
          title: `Sensasi Gurih Autentik: ${payload.productName}`,
          description: `Nikmati kelezatan istimewa dari ${payload.productName}! Dibuat dari bumbu rahasia warisan nusantara yang meresap sempurna hingga suapan terakhir.`,
          instagramCaption: `Siapa yang tahan sama godaan ${payload.productName}? 🤤✨ Diracik dengan bumbu istimewa yang bikin nagih! Pesan sekarang di Delish House!`,
          hashtags: ['#KulinerLokal', '#DelishHouse', '#UMKMKuliner', `#${payload.productName.replace(/\s+/g, '')}`]
        }
      };
    }
  },

  // Get AI Recommendation
  async getAiRecommendations(payload) {
    try {
      const res = await fetch(`${API_BASE}/ai/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch (err) {
      console.warn('AI Recommendation fallback:', err.message);
      return {
        success: true,
        summary: 'Rekomendasi pilihan kuliner lezat terbaik untuk Anda:',
        data: [
          {
            menu_id: 1,
            menu_name: 'Porsi Lengkap Kupang Lontong + Sate Kerang',
            price: 22000,
            merchant_name: 'Kupang Lontong Pak Misari',
            city: 'Sidoarjo',
            rating: 4.9,
            whatsapp: '6281234567890'
          }
        ]
      };
    }
  }
};
