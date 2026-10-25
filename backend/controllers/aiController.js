const db = require('../config/db');

/**
 * AI Copywriter Engine for Culinary UMKM
 * Generates compelling marketing copy, captions, and descriptions in Indonesian.
 */
const generateCopywriting = async (req, res) => {
  try {
    const { productName, category, keyIngredients, tone } = req.body;

    if (!productName) {
      return res.status(400).json({
        success: false,
        message: 'Nama produk kuliner wajib diisi.'
      });
    }

    const selectedTone = tone || 'appetizing';
    const ingText = keyIngredients ? `dengan bahan pilihan ${keyIngredients}` : 'dengan racikan bumbu khas istimewa';

    let title = '';
    let description = '';
    let callToAction = '';
    let instagramCaption = '';
    let hashtags = [];

    if (selectedTone === 'appetizing') {
      title = `Sensasi Gurih Autentik: ${productName}`;
      description = `Manjakan lidahmu dengan kelezatan istimewa dari ${productName}! Diolah dari bahan-bahan segar berkualitas ${ingText}, setiap gigitan menghadirkan harmoni cita rasa rempah nusantara yang meresap sempurna hingga ke lapisan terdalam. Aromanya yang harum siap membangkitkan selera makanmu seketika.`;
      callToAction = `Pesan sekarang sebelum kehabisan! Nikmati hidangan hangat langsung di meja makanmu.`;
      instagramCaption = `Siapa yang tahan sama godaan ${productName}? 🤤✨\n\nDiracik dengan penuh cinta ${ingText}, hidangan ini siap jadi mood booster harimu! Teksturnya pas, bumbunya medok, dan pastinya bikin ketagihan dari suapan pertama.\n\n👉 Yuk cobain sekarang dan rasakan bedanya!\nHubungi CS kami melalui WhatsApp untuk pemesanan cepat!`;
      hashtags = ['#KulinerLokal', '#DelishHouse', '#UMKMKuliner', '#MakanEnak', `#${productName.replace(/\s+/g, '')}`];
    } else if (selectedTone === 'promo') {
      title = `🔥 PROMO SPESIAL HARI INI: ${productName}!`;
      description = `Kabar gembira buat para pecinta kuliner! Dapatkan kenikmatan ${productName} ${ingText} dengan harga paling hemat hari ini. Porsi melimpah, rasa bintang lima, harga tetap ramah kantong.`;
      callToAction = `Buruan order hari ini! Kuota porsi promo sangat terbatas setiap harinya.`;
      instagramCaption = `ALERT PECINTA KULINER! 🚨 Jangan sampai kelewatan promo spesial ${productName}!\n\nPerpaduan rasa gurih mantap ${ingText} yang gak pernah gagal bikin kenyang dan bahagia. Cocok banget buat makan siang bareng teman kantor atau santap malam bareng keluarga.\n\n⚡ Slot promo terbatas! Langsung klik link di bio / WhatsApp kami ya!`;
      hashtags = ['#PromoKuliner', '#DiskonMakan', '#KulinerMurah', '#DelishPromo', '#JajanHemat'];
    } else if (selectedTone === 'casual') {
      title = `Nongkrong Makin Asik Bareng ${productName} 🤙`;
      description = `Lagi mager tapi perut keroncongan? ${productName} jawabannya! Paduan rasa nagih ${ingText} yang asik banget dinikmati sambil santai, nugas, atau nonton film favoritmu.`;
      callToAction = `Langsung checkout sekarang, gak pakai ribet!`;
      instagramCaption = `Mood lagi berantakan? Tenang, ada ${productName} yang siap nemenin harimu! 😋👌\n\nRasa mantap ${ingText} yang gak ada tandingannya. Sekali coba dijamin auto nambah lagi dan lagi!\n\nYuk langsung gas order via WhatsApp Delish House sekarang! 🚀`;
      hashtags = ['#NongkrongAsik', '#JajanKekinian', '#FoodiesIndo', '#DelishVibes', '#MakanKuy'];
    } else {
      // Storytelling / Resep Warisan
      title = `Warisan Tradisi Rasa: ${productName}`;
      description = `Setiap sajian ${productName} membawa warisan resep turun-temurun ${ingText}. Dimasak perlahan dengan dedikasi tinggi agar kualitas rasa klasik khas nusantara tetap terjaga seutuhnya.`;
      callToAction = `Rasakan kembali kehangatan cita rasa nusantara sejati hari ini.`;
      instagramCaption = `Sebuah dedikasi untuk melestarikan kelezatan tradisional: ${productName} 🌿\n\nSetiap rempah ${ingText} dipilih secara teliti untuk menghasilkan kenikmatan autentik yang mengingatkan kita pada kehangatan masakan rumah.\n\nDukung pedagang kuliner lokal kita bersama Delish House! Pesan sekarang!`;
      hashtags = ['#ResepTradisional', '#KulinerNusantara', '#CintaProdukLokal', '#DelishHeritage'];
    }

    const resultData = {
      productName,
      tone: selectedTone,
      title,
      description,
      callToAction,
      instagramCaption,
      hashtags
    };

    // Log AI prompt and response into database
    await db.run(
      'INSERT INTO ai_logs (log_type, prompt_input, ai_output) VALUES (?, ?, ?)',
      ['copywriter', JSON.stringify({ productName, category, keyIngredients, tone }), JSON.stringify(resultData)]
    );

    res.json({
      success: true,
      message: 'Deskripsi produk berhasil dioptimalkan oleh AI!',
      data: resultData
    });
  } catch (err) {
    console.error('Error in AI Copywriter:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses AI Copywriter', error: err.message });
  }
};

/**
 * AI Culinary Recommendation Engine
 * Matches budget, mood, and location with real UMKM menus.
 */
const getRecommendations = async (req, res) => {
  try {
    const { budget, mood, city } = req.body;

    let maxPrice = 999999;
    if (budget === 'hemat') maxPrice = 20000;
    else if (budget === 'sedang') maxPrice = 35000;
    else if (budget === 'puas') maxPrice = 999999;

    let query = `
      SELECT m.id AS menu_id, m.name AS menu_name, m.price, m.category AS menu_category,
             m.image_url, m.description AS menu_description, m.spice_level,
             v.id AS merchant_id, v.name AS merchant_name, v.city, v.rating, v.whatsapp
      FROM menus m
      JOIN merchants v ON m.merchant_id = v.id
      WHERE m.price <= ?
    `;
    const params = [maxPrice];

    if (city && city !== 'all') {
      query += ' AND v.city LIKE ?';
      params.push(`%${city}%`);
    }

    // Filter by mood/flavor profile
    if (mood === 'pedas') {
      query += ' AND (m.spice_level >= 2 OR m.name LIKE "%mercon%" OR m.name LIKE "%sambal%" OR m.description LIKE "%pedas%")';
    } else if (mood === 'berkuah') {
      query += ' AND (m.name LIKE "%kuah%" OR m.name LIKE "%rawon%" OR m.name LIKE "%soto%" OR m.name LIKE "%kupang%" OR m.category = "Makanan Berat")';
    } else if (mood === 'manis-segar') {
      query += ' AND (m.category IN ("Minuman & Kopi", "Dessert & Manisan", "Minuman") OR m.name LIKE "%es%" OR m.name LIKE "%sinom%")';
    } else if (mood === 'camilan') {
      query += ' AND (m.category IN ("Camilan & Gorengan", "Dessert & Manisan") OR m.name LIKE "%lumpia%" OR m.price < 20000)';
    }

    query += ' ORDER BY v.rating DESC, m.is_bestseller DESC LIMIT 6';

    const recommendations = await db.all(query, params);

    // If query was too restrictive, fallback to bestsellers within budget
    let results = recommendations;
    if (results.length === 0) {
      const fallbackQuery = `
        SELECT m.id AS menu_id, m.name AS menu_name, m.price, m.category AS menu_category,
               m.image_url, m.description AS menu_description, m.spice_level,
               v.id AS merchant_id, v.name AS merchant_name, v.city, v.rating, v.whatsapp
        FROM menus m
        JOIN merchants v ON m.merchant_id = v.id
        ORDER BY v.rating DESC, m.is_bestseller DESC LIMIT 4
      `;
      results = await db.all(fallbackQuery, []);
    }

    const aiSummary = `Berdasarkan preferensi suasana '${mood || 'umum'}' dengan estimasi anggaran '${budget || 'fleksibel'}' di area '${city || 'Sekitar'}', AI Delish House menemukan ${results.length} menu kuliner lokal terbaik untukmu!`;

    // Log recommendation query
    await db.run(
      'INSERT INTO ai_logs (log_type, prompt_input, ai_output) VALUES (?, ?, ?)',
      ['recommendation', JSON.stringify({ budget, mood, city }), JSON.stringify({ count: results.length })]
    );

    res.json({
      success: true,
      summary: aiSummary,
      count: results.length,
      data: results
    });
  } catch (err) {
    console.error('Error in AI Recommendation:', err);
    res.status(500).json({ success: false, message: 'Gagal memproses rekomendasi AI', error: err.message });
  }
};

module.exports = {
  generateCopywriting,
  getRecommendations
};

