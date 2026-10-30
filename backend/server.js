require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '127.0.0.1';

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Request Logger (Development)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Selamat datang di API Delish House — Platform UMKM Kuliner Berbasis AI',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan.'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan pada server.',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`🚀 Delish House Backend API is running on http://${HOST}:${PORT}`);
  console.log(`📡 Health Check: http://${HOST}:${PORT}/api/health`);
  console.log(`🏪 UMKM Catalog: http://${HOST}:${PORT}/api/merchants`);
});

