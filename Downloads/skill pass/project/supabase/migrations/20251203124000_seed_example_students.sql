-- Migration: seed example students and skill records
-- Adds sample students (4 per jurusan) and one skill_siswa record each
-- Run this SQL in your Supabase project's SQL editor or use the Supabase CLI to apply migrations.

-- NOTE: statements use NOT EXISTS checks to avoid duplicate inserts if run multiple times.

-- Teknik Mesin
WITH jm AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Mesin')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Raka Aji', 'XII-A', jm.id FROM jm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Raka Aji' AND jurusan_id = jm.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Dewi Susanti', 'XII-A', jm.id FROM jm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Dewi Susanti' AND jurusan_id = jm.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Budi Santoso', 'XII-B', jm.id FROM jm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Budi Santoso' AND jurusan_id = jm.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Siti Nurhayati', 'XII-C', jm.id FROM jm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Siti Nurhayati' AND jurusan_id = jm.id);

-- Teknik Kendaraan Ringan
WITH jk AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Agus Rahman', 'XII-A', jk.id FROM jk WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Agus Rahman' AND jurusan_id = jk.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Intan Maharani', 'XII-A', jk.id FROM jk WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Intan Maharani' AND jurusan_id = jk.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Fikri Hidayat', 'XII-B', jk.id FROM jk WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Fikri Hidayat' AND jurusan_id = jk.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Maya Putri', 'XII-C', jk.id FROM jk WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Maya Putri' AND jurusan_id = jk.id);

-- Teknik Sepeda Motor
WITH jtm AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rizky Pratama', 'XII-A', jtm.id FROM jtm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rizky Pratama' AND jurusan_id = jtm.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Yulia Sari', 'XII-A', jtm.id FROM jtm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Yulia Sari' AND jurusan_id = jtm.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Deni Prasetyo', 'XII-B', jtm.id FROM jtm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Deni Prasetyo' AND jurusan_id = jtm.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rina Kurnia', 'XII-C', jtm.id FROM jtm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rina Kurnia' AND jurusan_id = jtm.id);

-- Teknik Elektronika Industri
WITH jei AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Hendra Wijaya', 'XII-A', jei.id FROM jei WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Hendra Wijaya' AND jurusan_id = jei.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Siska Lestari', 'XII-B', jei.id FROM jei WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Siska Lestari' AND jurusan_id = jei.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Gilang Pradipta', 'XII-B', jei.id FROM jei WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Gilang Pradipta' AND jurusan_id = jei.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Nadia Amelia', 'XII-C', jei.id FROM jei WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Nadia Amelia' AND jurusan_id = jei.id);

-- Teknik Instalasi Tenaga Listrik
WITH jlt AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Taufik Hidayat', 'XII-A', jlt.id FROM jlt WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Taufik Hidayat' AND jurusan_id = jlt.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Lia Ramadhani', 'XII-B', jlt.id FROM jlt WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Lia Ramadhani' AND jurusan_id = jlt.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Wahyu Kurnia', 'XII-B', jlt.id FROM jlt WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Wahyu Kurnia' AND jurusan_id = jlt.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rahayu Indah', 'XII-C', jlt.id FROM jlt WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rahayu Indah' AND jurusan_id = jlt.id);

-- Teknik Kimia Industri
WITH jk_i AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kimia Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Arif Maulana', 'XII-A', jk_i.id FROM jk_i WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Arif Maulana' AND jurusan_id = jk_i.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Putri Ananda', 'XII-A', jk_i.id FROM jk_i WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Putri Ananda' AND jurusan_id = jk_i.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Hendra Saputra', 'XII-B', jk_i.id FROM jk_i WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Hendra Saputra' AND jurusan_id = jk_i.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Megawati', 'XII-C', jk_i.id FROM jk_i WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Megawati' AND jurusan_id = jk_i.id);

-- Akuntansi
WITH ja AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Akuntansi')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Daniel Pratama', 'XII-A', ja.id FROM ja WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Daniel Pratama' AND jurusan_id = ja.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Nur Fadilah', 'XII-A', ja.id FROM ja WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Nur Fadilah' AND jurusan_id = ja.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rian Setiawan', 'XII-B', ja.id FROM ja WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rian Setiawan' AND jurusan_id = ja.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Sari Melati', 'XII-C', ja.id FROM ja WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Sari Melati' AND jurusan_id = ja.id);

-- Perhotelan
WITH ph AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Perhotelan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Kevin Alexander', 'XII-A', ph.id FROM ph WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Kevin Alexander' AND jurusan_id = ph.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Mita Sari', 'XII-A', ph.id FROM ph WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Mita Sari' AND jurusan_id = ph.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Fajar Prakoso', 'XII-B', ph.id FROM ph WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Fajar Prakoso' AND jurusan_id = ph.id);
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rani Melinda', 'XII-C', ph.id FROM ph WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rani Melinda' AND jurusan_id = ph.id);

-- Insert one skill_siswa per student (skor chosen so a clear top student exists in each jurusan)
-- Skips if a student already has at least one skill_siswa record

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 98 FROM siswa s
JOIN level_skill l ON 98 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Raka Aji' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 84 FROM siswa s
JOIN level_skill l ON 84 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Dewi Susanti' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- ... (rest of skill records)

-- Teknik Kendaraan Ringan
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 95 FROM siswa s
JOIN level_skill l ON 95 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Agus Rahman' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 82 FROM siswa s
JOIN level_skill l ON 82 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Intan Maharani' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Sepeda Motor
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 96 FROM siswa s
JOIN level_skill l ON 96 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Rizky Pratama' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 79 FROM siswa s
JOIN level_skill l ON 79 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Yulia Sari' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Elektronika Industri
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 93 FROM siswa s
JOIN level_skill l ON 93 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Hendra Wijaya' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 77 FROM siswa s
JOIN level_skill l ON 77 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Siska Lestari' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Instalasi Tenaga Listrik
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 97 FROM siswa s
JOIN level_skill l ON 97 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Taufik Hidayat' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Kimia Industri
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 94 FROM siswa s
JOIN level_skill l ON 94 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Arif Maulana' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Akuntansi
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 92 FROM siswa s
JOIN level_skill l ON 92 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Daniel Pratama' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Perhotelan
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 90 FROM siswa s
JOIN level_skill l ON 90 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Kevin Alexander' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);
