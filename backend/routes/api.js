const express = require('express');
const router = express.Router();

const {
  getMerchants,
  getMerchantById,
  registerPartnership,
  addMenu,
  deleteMenu,
  updateMerchant,
  createOrder
} = require('../controllers/merchantController');

const { generateCopywriting, getRecommendations } = require('../controllers/aiController');
const { getStats } = require('../controllers/statsController');

// Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Delish House Backend API',
    timestamp: new Date().toISOString()
  });
});

// UMKM Merchant Routes
router.get('/merchants', getMerchants);
router.get('/merchants/:id', getMerchantById);
router.post('/merchants/register', registerPartnership);
router.put('/merchants/:id', updateMerchant);
router.post('/merchants/:id/menus', addMenu);
router.delete('/menus/:id', deleteMenu);

// Orders Routes (Buyer -> Seller)
router.post('/orders', createOrder);

// AI Features Routes
router.post('/ai/copywriter', generateCopywriting);
router.post('/ai/recommendation', getRecommendations);

// Statistics
router.get('/stats', getStats);

module.exports = router;
