const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 1. Lokasi file database asli di root
const originalDbPath = path.resolve(__dirname, '../../database/delish.db');

// 2. Cek apakah sedang berjalan di Vercel Serverless
const isVercel = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;
let dbPath;

if (isVercel) {
  // Di Vercel, salin database dari root ke /tmp agar bisa ditulis (INSERT/UPDATE produk)
  const tmpDbPath = '/tmp/delish.db';
  if (!fs.existsSync(tmpDbPath)) {
    if (fs.existsSync(originalDbPath)) {
      fs.copyFileSync(originalDbPath, tmpDbPath);
    }
  }
  dbPath = tmpDbPath;
} else {
  // Di komputer lokal, langsung pakai file di root/database/delish.db
  dbPath = originalDbPath;
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Gagal terhubung ke SQLite di:', dbPath, err.message);
  } else {
    console.log('✅ Berhasil terhubung ke SQLite:', dbPath);
  }
});

// Helper Promise wrappers
const all = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

module.exports = {
  db,
  all,
  get,
  run
};
