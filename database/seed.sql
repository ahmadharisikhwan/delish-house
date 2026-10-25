-- ===================================================================
-- Delish House - Platform UMKM Kuliner Berbasis AI
-- Seed Data (Data Awal UMKM Kuliner Indonesia)
-- ===================================================================

-- Insert Categories
INSERT OR IGNORE INTO categories (id, slug, name, icon, description) VALUES
(1, 'makanan-berat', 'Makanan Berat', 'utensils', 'Nasi, Mie, Bakso, Soto, dan hidangan utama yang mengenyangkan'),
(2, 'minuman', 'Minuman & Kopi', 'coffee', 'Kopi kekinian, teh herbal, es segar tradisional'),
(3, 'camilan', 'Camilan & Gorengan', 'cookie', 'Gorengan renyah, kerupuk, jajanan pasar'),
(4, 'dessert', 'Dessert & Manisan', 'ice-cream', 'Kue tradisional, es krim, puding, dan manisan');

-- Insert Merchants
INSERT OR IGNORE INTO merchants (id, name, owner_name, category_id, category_name, city, district, address, phone, whatsapp, rating, reviews_count, image_url, description, ai_highlight, is_verified) VALUES
(1, 'Kupang Lontong Pak Misari', 'Bapak Misari', 1, 'Makanan Berat', 'Sidoarjo', 'Sidoarjo Kota', 'Jl. Mojopahit No. 25, Sidokumpul, Sidoarjo', '081234567890', '6281234567890', 4.9, 342, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80', 'Kuliner legendaris khas Sidoarjo sejak 1994 dengan racikan kupang segar, bumbu petis manis gurih, dan sate kerang renyah.', 'Paling laris di Sidoarjo: Cita rasa petis autentik dengan lentho gurih khas pesisir Jawa Timur.', 1),
(2, 'Bebek Sinjay Cabang Madura', 'Ibu Sinjay', 1, 'Makanan Berat', 'Surabaya', 'Gubeng', 'Jl. Dharmawangsa No. 112, Gubeng, Surabaya', '081298765432', '6281298765432', 4.8, 520, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&auto=format&fit=crop&q=80', 'Bebek goreng renyah bumbu rempah rempah khas Madura dengan sambal mangga muda (pencit) segar pedas asam nendang.', 'Daging bebek empuk juicy sampai ke tulang, dipadu sambal pencit segar yang bikin ketagihan.', 1),
(3, 'Rawon Kalkun Warung Soepardi', 'Bapak Soepardi', 1, 'Makanan Berat', 'Sidoarjo', 'Waru', 'Jl. Letjen Sutoyo No. 45, Medaeng, Waru, Sidoarjo', '082155667788', '6282155667788', 4.8, 198, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&auto=format&fit=crop&q=80', 'Inovasi rawon daging kalkun dengan kuah kluwek hitam pekat kental, rempah harum, serta sambal terasi teruji.', 'Keunikan daging kalkun rendah lemak dalam kuah rawon kental gurih khas Jawa Timur.', 1),
(4, 'Tahu Tek & Tahu Telur Cak Ali', 'Cak Ali', 1, 'Makanan Berat', 'Surabaya', 'Wonokromo', 'Jl. Raya Darmo Permai No. 8, Wonokromo, Surabaya', '085711223344', '6285711223344', 4.7, 145, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80', 'Tahu telur goreng lembut disiram saus petis kacang kental medok, lontong empuk, tauge segar dan kerupuk udang melimpah.', 'Racikan petis udang Sidoarjo kelas satu yang legit dan bikin nagih setiap suapannya.', 1),
(5, 'Es Sinom & Beras Kencur Bu Drajat', 'Ibu Drajat', 2, 'Minuman & Kopi', 'Sidoarjo', 'Candi', 'Jl. Raya Candi No. 78, Candi, Sidoarjo', '087899887766', '6287899887766', 4.9, 210, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80', 'Jamu segar dingin alami berbahan daun asam muda (sinom) dan kunyit asli tanpa pengawet sintesis, menyegarkan dahaga.', 'Minuman herbal warisan nusantara dingin segar, kaya antioksidan dan 100% gula tebu murni.', 1),
(6, 'Kopi Cingkir & Jahe Merah Seduh', 'Kang Nanang', 2, 'Minuman & Kopi', 'Sidoarjo', 'Taman', 'Jl. Sepanjang Indah No. 14, Taman, Sidoarjo', '081344556677', '6281344556677', 4.7, 95, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=80', 'Kopi tubruk khas warkop Jawa Timur disajikan cangkir klasik dengan racikan jahe merah geprek asli pegunungan.', 'Aroma sangrai kopi robusta lokal berpadu hangatnya jahe merah, pas buat santai sore.', 1),
(7, 'Lumpia Basah & Goreng Bu Siti', 'Ibu Siti Khodijah', 3, 'Camilan & Gorengan', 'Sidoarjo', 'Gedangan', 'Jl. Ahmad Yani No. 89, Gedangan, Sidoarjo', '085677889900', '6285677889900', 4.8, 160, 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=600&auto=format&fit=crop&q=80', 'Lumpia renyah dengan isian rebung segar manis gurih, udang cincang, dan saus cocolan bawang manis khas.', 'Kulit lumpia buatan tangan super renyah dengan isian padat kaya rempah nusantara.', 1),
(8, 'Es Pisang Ijo Somba Opu', 'Daeng Rasyid', 4, 'Dessert & Manisan', 'Surabaya', 'Tegalsari', 'Jl. Basuki Rahmat No. 32, Surabaya', '081288776655', '6281288776655', 4.9, 280, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&auto=format&fit=crop&q=80', 'Pisang raja matang dibalut adonan pandan lembut, disiram bubur sumsum wangi, sirup merah DHT legendaris, dan susu kental manis.', 'Perpaduan lembutnya pisang raja manis alami dan bubur sumsum gurih dengan aroma daun pandan asli.', 1);

-- Insert Menus
INSERT OR IGNORE INTO menus (id, merchant_id, name, category, description, price, image_url, is_bestseller, is_recommended, spice_level) VALUES
(1, 1, 'Porsi Lengkap Kupang Lontong + Sate Kerang', 'Makanan Berat', 'Satu piring kupang kuah petis gurih lengkap dengan lontong, lentho singkong renyah, dan 5 tusuk sate kerang.', 22000, 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80', 1, 1, 1),
(2, 1, 'Es Degan Murni Gula Kelapa', 'Minuman', 'Air kelapa muda segar asli batok dengan perasan jeruk nipis dan pemanis gula aren cair.', 7000, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&auto=format&fit=crop&q=80', 0, 1, 0),
(3, 2, 'Paket Bebek Goreng Kremes Sambal Pencit', 'Makanan Berat', 'Nasi putih pulen hangat, 1 potong bebek paha/dada bumbu kuning goreng, serundeng renyah, lalapan, sambal mangga muda.', 32000, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&auto=format&fit=crop&q=80', 1, 1, 3),
(4, 2, 'Paket Ayam Kampung Sambal Korek', 'Makanan Berat', 'Ayam kampung ungkep gurih rempah digoreng garing dengan siraman sambal korek bawang pedas membara.', 28000, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&auto=format&fit=crop&q=80', 0, 1, 3),
(5, 3, 'Rawon Daging Kalkun Spesial', 'Makanan Berat', 'Rawon kuah kluwek mantap dengan potongan daging kalkun lembut, tauge pendek segar, sambal terasi, dan kerupuk udang.', 30000, 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&auto=format&fit=crop&q=80', 1, 1, 2),
(6, 4, 'Tahu Telur Saus Petis Medok', 'Makanan Berat', 'Telur dadar campur tahu sutra goreng mekar, disiram saus petis kacang tanah khas, taburan seledri dan bawang goreng.', 18000, 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80', 1, 1, 2),
(7, 5, 'Sinom Daun Asam Botol 500ml', 'Minuman & Kopi', 'Sinom segar dari rebusan daun asam jawa muda pilihan, kunyit emprit, dan gula batu alami. Tanpa pemanis buatan.', 10000, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&auto=format&fit=crop&q=80', 1, 1, 0),
(8, 6, 'Kopi Jahe Merah Cangkir Seng', 'Minuman & Kopi', 'Kopi robusta dampit dipadukan rebusan jahe merah geprek dan serai wangi, menghangatkan tubuh seketika.', 8000, 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&auto=format&fit=crop&q=80', 1, 1, 0),
(9, 7, 'Lumpia Goreng Spesial Isi 3', 'Camilan & Gorengan', 'Lumpia renyah isi rebung manis, telur orak-arik, dan udang cincang gurih, disajikan dengan daun bawang dan cabai rawit.', 15000, 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400&auto=format&fit=crop&q=80', 1, 1, 1),
(10, 8, 'Porsi Komplit Es Pisang Ijo Pandan Wangi', 'Dessert & Manisan', 'Pisang ijo lembut dengan bubur sumsum gurih, serutan es batu, sirup DHT merah aromatik, kental manis, dan kacang sangrai.', 16000, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&auto=format&fit=crop&q=80', 1, 1, 0);

-- Insert Sample Partnerships
INSERT OR IGNORE INTO partnerships (id, vendor_name, vendor_category, vendor_city, vendor_phone, status, notes) VALUES
(1, 'Bakso Granat Mas Bejo', 'makanan-berat', 'Sidoarjo', '081234567801', 'approved', 'Sudah terverifikasi via WhatsApp'),
(2, 'Es Cendol Durian Ratu', 'dessert', 'Surabaya', '081234567802', 'approved', 'Menunggu upload menu'),
(3, 'Warung Kopi Senja Kelana', 'minuman', 'Sidoarjo', '081234567803', 'pending', 'Pendaftaran baru');



-- Insert Sample Orders for Seller Dashboard Demo
INSERT OR IGNORE INTO orders (id, merchant_id, buyer_name, buyer_phone, items_summary, total_price, notes, status) VALUES
(1, 1, 'Rian Syahputra', '081234567811', '2x Porsi Lengkap Kupang Lontong, 1x Es Degan Murni', 51000, 'Lentho dipisah, petis agak pedas', 'Baru'),
(2, 1, 'Dewi Lestari', '085712349900', '1x Porsi Lengkap Kupang Lontong, 5x Sate Kerang Tambahan', 32000, 'Kirim ke kantor Pemda Sidoarjo', 'Diproses'),
(3, 1, 'Budi Santoso', '087811223344', '3x Porsi Lengkap Kupang Lontong', 66000, 'Makan siang jam 12.30', 'Selesai'),
(4, 2, 'Farhan Maulana', '082155667799', '2x Paket Bebek Goreng Kremes Sambal Pencit', 64000, 'Sambal pencit dipisah ya mas', 'Baru');
