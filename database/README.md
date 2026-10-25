# 🗄️ Delish House - Database Layer

Direktori ini mengelola basis data untuk platform **Delish House (UMKM Kuliner Berbasis AI)**.

## 📂 Struktur Berkas
- `schema.sql`: Definisi struktur tabel SQL (`categories`, `merchants`, `menus`, `partnerships`, `ai_logs`).
- `seed.sql`: Data awal (*seed data*) UMKM kuliner lokal (Sidoarjo & Surabaya), menu kuliner, dan contoh pendaftaran kemitraan.
- `delish.db`: File SQLite database lokal yang digunakan oleh backend.
- `init.js`: Skrip otomatisasi untuk me-reset dan menyemai ulang (*re-seed*) database.

## 🚀 Cara Menjalankan & Reset Database
Untuk melakukan inisialisasi ulang basis data:
```bash
node database/init.js
```

