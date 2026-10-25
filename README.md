# 🍽️ Delish House — Platform UMKM Kuliner Berbasis AI

Platform web modern yang memberdayakan pelaku usaha mikro, kecil, dan menengah (UMKM) kuliner di Indonesia melalui integrasi kecerdasan buatan (*Artificial Intelligence*), etalase kuliner interaktif, dan komunikasi instan tanpa potongan komisi.

Proyek ini telah direstrukturisasi secara profesional menjadi arsitektur modular terpisah: **Frontend (React.js)**, **Backend (Node.js & Express)**, dan **Database (SQLite)**.

---

## 📂 Struktur Direktori Proyek

```plaintext
delish/
├── frontend/                   # ⚛️ Aplikasi Antarmuka Pengguna (React.js + Vite)
│   ├── public/assets/          # Aset logo, ilustrasi, & ikon WebP terkompresi
│   ├── src/
│   │   ├── components/         # Komponen React modular (Navbar, Hero, AiTools, Catalog, dll)
│   │   ├── services/           # Service koneksi REST API ke backend (api.js)
│   │   ├── App.jsx             # Komponen utama aplikasi
│   │   ├── index.css           # Desain sistem responsif & styling
│   │   └── main.jsx            # Entry point React 18
│   ├── index.html              # Template HTML utama
│   ├── vite.config.js          # Konfigurasi Vite & API Proxy
│   └── package.json
│
├── backend/                    # 🚀 Server RESTful API (Node.js & Express)
│   ├── config/
│   │   └── db.js               # Koneksi basis data SQLite & helper queries
│   ├── controllers/
│   │   ├── merchantController.js # Manajemen data UMKM & form kemitraan
│   │   ├── aiController.js     # AI Copywriter & AI Culinary Recommendation Engine
│   │   └── statsController.js  # Statistik platform real-time
│   ├── routes/
│   │   └── api.js              # Definisi rute endpoint RESTful API
│   ├── server.js               # Server utama Express (Port: 5000)
│   ├── .env                    # Variabel lingkungan
│   └── package.json
│
├── database/                   # 🗄️ Lapisan Basis Data (SQLite)
│   ├── schema.sql              # Skema tabel (merchants, menus, partnerships, ai_logs)
│   ├── seed.sql                # Data awal kuliner lokal (Sidoarjo & Surabaya)
│   ├── delish.db               # Berkas basis data SQLite aktif
│   └── init.js                 # Skrip inisialisasi & reset basis data
│
├── .gitignore                  # Konfigurasi pengabaian berkas sementara / cache
├── package.json                # Skrip root untuk menjalankan aplikasi
└── README.md                   # Dokumentasi resmi repositori
```

---

## ⚡ Panduan Menjalankan Aplikasi

Pastikan **Node.js** (v18+) dan **npm** sudah terpasang di komputer Anda.

### 1. Inisialisasi Basis Data (Opsional / Reset Data)
Basis data SQLite sudah disiapkan dengan data kuliner lokal. Jika ingin mereset atau mengisi ulang:
```bash
node database/init.js
```

---

### 2. Menjalankan Backend (Port 5000)
Buka terminal:
```bash
cd backend
npm run dev
```
Backend API aktif di: **`http://localhost:5000`**
- Health Check: `http://localhost:5000/api/health`
- Katalog UMKM: `http://localhost:5000/api/merchants`
- Statistik: `http://localhost:5000/api/stats`

---

### 3. Menjalankan Frontend React.js (Port 3000)
Buka terminal baru:
```bash
cd frontend
npm run dev
```
Buka peramban (*browser*) Anda di: **`http://localhost:3000`**

---

## 👥 Tim Pengembang
- **Nama Tim**: Tim Anomali
- **Asal Sekolah**: SMK Antartika 1 Sidoarjo
- **Proyek**: Delish House — Platform UMKM Kuliner Berbasis AI
