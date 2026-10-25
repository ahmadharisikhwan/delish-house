const db = require('../config/db');

// GET /api/stats
const getStats = async (req, res) => {
  try {
    const merchantRow = await db.get('SELECT COUNT(*) AS count FROM merchants');
    const menuRow = await db.get('SELECT COUNT(*) AS count FROM menus');
    const partnershipRow = await db.get('SELECT COUNT(*) AS count FROM partnerships');
    const aiLogRow = await db.get('SELECT COUNT(*) AS count FROM ai_logs');

    res.json({
      success: true,
      data: {
        registeredUmkm: 500 + (merchantRow?.count || 0) + (partnershipRow?.count || 0),
        culinaryMenus: 10000 + (menuRow?.count || 0),
        citiesCovered: '25+',
        satisfactionRate: '4.8/5',
        liveDbCounts: {
          merchants: merchantRow?.count || 0,
          menus: menuRow?.count || 0,
          partnerships: partnershipRow?.count || 0,
          aiGenerations: aiLogRow?.count || 0
        }
      }
    });
  } catch (err) {
    console.error('Error getting stats:', err);
    res.status(500).json({ success: false, message: 'Gagal mengambil data statistik', error: err.message });
  }
};

module.exports = {
  getStats
};

