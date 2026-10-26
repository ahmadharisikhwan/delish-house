const db = require('../config/db');

// GET /api/merchants
const getMerchants = async (req, res) => {
  try {
    const { category, city, q } = req.query;
    let sql = 'SELECT * FROM merchants WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
      sql += ' AND (category_name LIKE ? OR category_id = ?)';
      params.push(`%${category}%`, category);
    }

    if (city && city !== 'all') {
      sql += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }

    if (q) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR ai_highlight LIKE ?)';
      params.push(`%${q}%`, `%${q}%`, `%${q}%`);
    }

    sql += ' ORDER BY rating DESC, reviews_count DESC';

    const merchants = await db.all(sql, params);

    // Fetch menus for each merchant
    const merchantsWithMenus = await Promise.all(
      merchants.map(async (m) => {
        const menus = await db.all('SELECT * FROM menus WHERE merchant_id = ? ORDER BY is_bestseller DESC', [m.id]);
        return { ...m, menus };
      })
    );

    res.json({
      success: true,
      count: merchantsWithMenus.length,
      data: merchantsWithMenus
    });
  } catch (err) {
    console.error('Error getting merchants:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data UMKM', error: err.message });
  }
};

// GET /api/merchants/:id
const getMerchantById = async (req, res) => {
  try {
    const { id } = req.params;
    const merchant = await db.get('SELECT * FROM merchants WHERE id = ?', [id]);

    if (!merchant) {
      return res.status(404).json({ success: false, message: 'UMKM tidak ditemukan' });
    }

    const menus = await db.all('SELECT * FROM menus WHERE merchant_id = ? ORDER BY is_bestseller DESC, id DESC', [id]);
    const orders = await db.all('SELECT * FROM orders WHERE merchant_id = ? ORDER BY id DESC LIMIT 10', [id]).catch(() => []);

    res.json({
      success: true,
      data: {
        ...merchant,
        menus,
        orders
      }
    });
  } catch (err) {
    console.error('Error getting merchant details:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil detail UMKM', error: err.message });
  }
};

// POST /api/merchants/register
const registerPartnership = async (req, res) => {
  try {
    const { vendorName, ownerName, vendorCategory, vendorCity, vendorPhone, address, description, notes } = req.body;

    if (!vendorName || !vendorCategory || !vendorCity || !vendorPhone) {
      return res.status(400).json({
        success: false,
        message: 'Mohon lengkapi semua bidang pendaftaran (Nama Usaha, Kategori, Kota, WhatsApp)'
      });
    }

    // 1. Insert into partnerships
    const partnershipSql = `
      INSERT INTO partnerships (vendor_name, vendor_category, vendor_city, vendor_phone, notes, status)
      VALUES (?, ?, ?, ?, ?, 'approved')
    `;
    const partResult = await db.run(partnershipSql, [vendorName, vendorCategory, vendorCity, vendorPhone, notes || '']);

    // 2. Also register directly into merchants table so seller immediately has an active dashboard!
    const cleanPhone = vendorPhone.replace(/\D/g, '');
    const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

    const merchantSql = `
      INSERT INTO merchants (name, owner_name, category_name, city, address, phone, whatsapp, rating, reviews_count, description, ai_highlight, is_verified)
      VALUES (?, ?, ?, ?, ?, ?, ?, 5.0, 1, ?, ?, 1)
    `;

    const defaultDesc = description || `Usaha kuliner lokal berkualitas di ${vendorCity}. Menyajikan aneka pilihan menu lezat khas nusantara.`;
    const defaultAiHighlight = `Mitra UMKM baru di ${vendorCity}: Cita rasa khas lokal pilihan dengan pelayanan ramah.`;
    const defaultAddress = address || `Jl. Utama No. 1, ${vendorCity}`;

    const merchantResult = await db.run(merchantSql, [
      vendorName,
      ownerName || 'Pemilik Usaha',
      vendorCategory,
      vendorCity,
      defaultAddress,
      vendorPhone,
      waNumber,
      defaultDesc,
      defaultAiHighlight
    ]);

    // Insert an initial starter menu for this new merchant
    await db.run(`
      INSERT INTO menus (merchant_id, name, category, description, price, is_bestseller, is_recommended)
      VALUES (?, ?, ?, ?, ?, 1, 1)
    `, [
      merchantResult.id,
      `Menu Spesial ${vendorName}`,
      vendorCategory,
      `Sajian andalan lezat dari ${vendorName} dibuat dengan bumbu pilihan.`,
      25000
    ]);

    res.status(201).json({
      success: true,
      message: `Selamat! Toko "${vendorName}" berhasil terdaftar dan aktif di Delish House.`,
      data: {
        id: merchantResult.id,
        partnershipId: partResult.id,
        name: vendorName,
        ownerName: ownerName || 'Pemilik Usaha',
        category_name: vendorCategory,
        city: vendorCity,
        phone: vendorPhone,
        whatsapp: waNumber,
        address: defaultAddress,
        role: 'seller'
      }
    });
  } catch (err) {
    console.error('Error registering partnership:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses pendaftaran kemitraan', error: err.message });
  }
};

// POST /api/merchants/:id/menus - Seller adds a new menu item
const addMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, price, is_bestseller, is_recommended, spice_level, image_url } = req.body;

    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Nama menu dan harga wajib diisi' });
    }

    const sql = `
      INSERT INTO menus (merchant_id, name, category, description, price, is_bestseller, is_recommended, spice_level, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.run(sql, [
      id,
      name,
      category || 'Makanan Berat',
      description || '',
      parseInt(price, 10),
      is_bestseller ? 1 : 0,
      is_recommended ? 1 : 0,
      spice_level || 0,
      image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80'
    ]);

    res.status(201).json({
      success: true,
      message: `Menu "${name}" berhasil ditambahkan ke katalog toko!`,
      data: {
        id: result.id,
        merchant_id: id,
        name,
        category,
        description,
        price: parseInt(price, 10)
      }
    });
  } catch (err) {
    console.error('Error adding menu:', err);
    res.status(500).json({ success: false, message: 'Gagal menambahkan menu', error: err.message });
  }
};

// DELETE /api/menus/:id - Seller deletes a menu item
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await db.run('DELETE FROM menus WHERE id = ?', [id]);
    res.json({ success: true, message: 'Menu berhasil dihapus' });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ success: false, message: 'Gagal menghapus menu', error: err.message });
  }
};

// PUT /api/merchants/:id - Seller updates shop profile
const updateMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, owner_name, city, address, phone, whatsapp, description } = req.body;

    const sql = `
      UPDATE merchants
      SET name = COALESCE(?, name),
          owner_name = COALESCE(?, owner_name),
          city = COALESCE(?, city),
          address = COALESCE(?, address),
          phone = COALESCE(?, phone),
          whatsapp = COALESCE(?, whatsapp),
          description = COALESCE(?, description)
      WHERE id = ?
    `;

    await db.run(sql, [name, owner_name, city, address, phone, whatsapp, description, id]);

    res.json({ success: true, message: 'Profil toko berhasil diperbarui!' });
  } catch (err) {
    console.error('Error updating merchant:', err);
    res.status(500).json({ success: false, message: 'Gagal memperbarui profil', error: err.message });
  }
};

// POST /api/orders - Buyer places order
const createOrder = async (req, res) => {
  try {
    const { merchant_id, buyer_name, buyer_phone, items_summary, total_price, notes } = req.body;

    if (!merchant_id || !buyer_name || !items_summary) {
      return res.status(400).json({ success: false, message: 'Data pesanan belum lengkap' });
    }

    const sql = `
      INSERT INTO orders (merchant_id, buyer_name, buyer_phone, items_summary, total_price, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, 'Baru')
    `;

    const result = await db.run(sql, [
      merchant_id,
      buyer_name,
      buyer_phone || '-',
      items_summary,
      total_price || 0,
      notes || ''
    ]);

    res.status(201).json({
      success: true,
      message: 'Pesanan berhasil dicatat dan siap dikirim via WhatsApp!',
      data: { id: result.id }
    });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, message: 'Gagal membuat pesanan', error: err.message });
  }
};

module.exports = {
  getMerchants,
  getMerchantById,
  registerPartnership,
  addMenu,
  deleteMenu,
  updateMerchant,
  createOrder
};
