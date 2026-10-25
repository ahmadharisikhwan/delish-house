# 🚀 Delish House - Backend API

RESTful API backend untuk platform **Delish House (UMKM Kuliner Berbasis AI)** yang dibangun menggunakan Node.js dan Express.js, terhubung dengan basis data SQLite di folder `database/`.

## 🛠️ Fitur & Endpoint API

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check status server |
| `GET` | `/api/merchants` | Daftar katalog UMKM kuliner (filter: `category`, `city`, `q`) |
| `GET` | `/api/merchants/:id` | Detail UMKM dan daftar menunya |
| `POST` | `/api/merchants/register` | Pendaftaran kemitraan UMKM baru (disimpan ke database) |
| `POST` | `/api/ai/copywriter` | Generator copywriting kuliner berbasis AI |
| `POST` | `/api/ai/recommendation` | Mesin rekomendasi menu kuliner pintar berdasarkan budget, mood & kota |
| `GET` | `/api/stats` | Data statistik platform real-time |

## 💻 Menjalankan Backend
```bash
# Masuk ke folder backend
cd backend

# Jalankan server
npm start

# Atau dengan mode development (watch)
npm run dev
```

Server akan aktif di: `http://localhost:5000`

