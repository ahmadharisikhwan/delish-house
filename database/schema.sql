-- ===================================================================
-- Delish House - Platform UMKM Kuliner Berbasis AI
-- Database Schema (SQLite / SQL Standard)
-- ===================================================================

PRAGMA foreign_keys = ON;

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Merchants (UMKM Kuliner) Table
CREATE TABLE IF NOT EXISTS merchants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  owner_name TEXT,
  category_id INTEGER,
  category_name TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  rating REAL DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  image_url TEXT,
  description TEXT,
  ai_highlight TEXT,
  is_verified INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 3. Menus (Daftar Sajian Kuliner) Table
CREATE TABLE IF NOT EXISTS menus (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  is_bestseller INTEGER DEFAULT 0,
  is_recommended INTEGER DEFAULT 0,
  spice_level INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- 4. Partnerships (Pendaftaran Mitra Baru UMKM) Table
CREATE TABLE IF NOT EXISTS partnerships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_name TEXT NOT NULL,
  vendor_category TEXT NOT NULL,
  vendor_city TEXT NOT NULL,
  vendor_phone TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, reviewed, approved, rejected
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table (Pesanan Masuk dari Pembeli ke Penjual)
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  merchant_id INTEGER NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  items_summary TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'Baru', -- Baru, Diproses, Selesai
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
);

-- 6. AI Recommendations Log Table
CREATE TABLE IF NOT EXISTS ai_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  log_type TEXT NOT NULL, -- 'copywriter' or 'recommendation'
  prompt_input TEXT,
  ai_output TEXT,
  user_ip TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_merchants_city ON merchants(city);
CREATE INDEX IF NOT EXISTS idx_merchants_category ON merchants(category_name);
CREATE INDEX IF NOT EXISTS idx_menus_merchant_id ON menus(merchant_id);
CREATE INDEX IF NOT EXISTS idx_menus_price ON menus(price);
CREATE INDEX IF NOT EXISTS idx_orders_merchant_id ON orders(merchant_id);
