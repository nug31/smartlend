/*
  # Skill Passport System - Database Schema

  ## Overview
  This migration creates the complete database structure for the Skill Passport system,
  which tracks student skills across 8 different vocational programs (jurusan).

  ## Tables Created

  ### 1. jurusan (Vocational Programs)
  Stores the 8 vocational programs available in the system:
  - `id` (uuid, primary key) - Unique identifier
  - `nama_jurusan` (text) - Program name
  - `icon` (text) - Icon identifier for UI display
  - `deskripsi` (text) - Program description
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. level_skill (Skill Levels & Badges)
  Defines the 4 skill levels with badge information:
  - `id` (uuid, primary key) - Unique identifier
  - `nama_level` (text) - Level name (Basic, Applied, Advance, Master)
  - `urutan` (integer) - Level order (1-4)
  - `min_skor` (integer) - Minimum score for this level
  - `max_skor` (integer) - Maximum score for this level
  - `badge_color` (text) - Badge color code
  - `badge_name` (text) - Badge display name
  - `hasil_belajar` (text) - Learning outcomes description
  - `soft_skill` (text) - Associated soft skills
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. siswa (Students)
  Stores student information:
  - `id` (uuid, primary key) - Unique identifier
  - `nama` (text) - Student full name
  - `kelas` (text) - Class/grade information
  - `jurusan_id` (uuid, foreign key) - Reference to jurusan table
  - `created_at` (timestamptz) - Record creation timestamp

  ### 4. skill_siswa (Student Skills)
  Tracks individual student skill scores and levels:
  - `id` (uuid, primary key) - Unique identifier
  - `siswa_id` (uuid, foreign key) - Reference to siswa table
  - `level_id` (uuid, foreign key) - Reference to level_skill table
  - `skor` (integer) - Skill score (0-100)
  - `tanggal_pencapaian` (timestamptz) - Achievement date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Public read access is granted for all tables (suitable for educational institution)
  - Authenticated users can insert and update student skill records
  - All policies are restrictive and check authentication where needed

  ## Indexes
  - Foreign key indexes for optimal query performance
  - Composite index on skill_siswa for common query patterns
*/

-- Create jurusan table
CREATE TABLE IF NOT EXISTS jurusan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_jurusan text NOT NULL,
  icon text NOT NULL,
  deskripsi text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create level_skill table
CREATE TABLE IF NOT EXISTS level_skill (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_level text NOT NULL,
  urutan integer NOT NULL,
  min_skor integer NOT NULL,
  max_skor integer NOT NULL,
  badge_color text NOT NULL,
  badge_name text NOT NULL,
  hasil_belajar text DEFAULT '',
  soft_skill text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create siswa table
CREATE TABLE IF NOT EXISTS siswa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  kelas text NOT NULL,
  jurusan_id uuid NOT NULL REFERENCES jurusan(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create skill_siswa table
CREATE TABLE IF NOT EXISTS skill_siswa (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  siswa_id uuid NOT NULL REFERENCES siswa(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES level_skill(id) ON DELETE CASCADE,
  skor integer NOT NULL CHECK (skor >= 0 AND skor <= 100),
  tanggal_pencapaian timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_siswa_jurusan ON siswa(jurusan_id);
CREATE INDEX IF NOT EXISTS idx_skill_siswa_siswa ON skill_siswa(siswa_id);
CREATE INDEX IF NOT EXISTS idx_skill_siswa_level ON skill_siswa(level_id);
CREATE INDEX IF NOT EXISTS idx_skill_siswa_skor ON skill_siswa(skor);
CREATE INDEX IF NOT EXISTS idx_skill_siswa_composite ON skill_siswa(siswa_id, level_id, skor);

-- Enable Row Level Security
ALTER TABLE jurusan ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_skill ENABLE ROW LEVEL SECURITY;
ALTER TABLE siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_siswa ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jurusan (Public read access)
CREATE POLICY "Anyone can view jurusan"
  ON jurusan FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert jurusan"
  ON jurusan FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update jurusan"
  ON jurusan FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for level_skill (Public read access)
CREATE POLICY "Anyone can view level_skill"
  ON level_skill FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert level_skill"
  ON level_skill FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update level_skill"
  ON level_skill FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for siswa (Public read access)
CREATE POLICY "Anyone can view siswa"
  ON siswa FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert siswa"
  ON siswa FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update siswa"
  ON siswa FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for skill_siswa (Public read access)
CREATE POLICY "Anyone can view skill_siswa"
  ON skill_siswa FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert skill_siswa"
  ON skill_siswa FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update skill_siswa"
  ON skill_siswa FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default skill levels
INSERT INTO level_skill (nama_level, urutan, min_skor, max_skor, badge_color, badge_name, hasil_belajar, soft_skill)
VALUES
  ('Pemula / Beginner', 1, 0, 25, '#94a3b8', 'Basic', 'Memahami konsep dasar dan terminologi dalam bidang keahlian', 'Komunikasi dasar, Kerjasama tim, Etika kerja'),
  ('Intermediate', 2, 26, 50, '#3b82f6', 'Applied', 'Mampu menerapkan pengetahuan dalam situasi praktis dengan bimbingan', 'Problem solving, Adaptabilitas, Inisiatif'),
  ('Advanced', 3, 51, 75, '#f59e0b', 'Advance', 'Menguasai keterampilan kompleks dan mampu bekerja secara mandiri', 'Kepemimpinan, Inovasi, Manajemen waktu'),
  ('Mastery', 4, 76, 100, '#10b981', 'Master', 'Ahli dalam bidangnya dan mampu membimbing orang lain', 'Mentoring, Strategic thinking, Excellence mindset')
ON CONFLICT DO NOTHING;

-- Insert 8 jurusan
INSERT INTO jurusan (nama_jurusan, icon, deskripsi)
VALUES
  ('Teknik Mesin', 'Settings', 'Program keahlian yang mempelajari perancangan, pembuatan, dan perawatan mesin'),
  ('Teknik Kendaraan Ringan', 'Car', 'Program keahlian yang fokus pada perbaikan dan perawatan kendaraan ringan'),
  ('Teknik Sepeda Motor', 'Bike', 'Program keahlian yang fokus pada servis dan perbaikan sepeda motor'),
  ('Teknik Elektronika Industri', 'Cpu', 'Program keahlian yang mempelajari sistem elektronika dan otomasi industri'),
  ('Teknik Instalasi Tenaga Listrik', 'Zap', 'Program keahlian yang mempelajari instalasi dan distribusi tenaga listrik'),
  ('Teknik Kimia Industri', 'FlaskConical', 'Program keahlian yang mempelajari proses produksi dan pengolahan kimia'),
  ('Akuntansi', 'Calculator', 'Program keahlian yang mempelajari pencatatan dan pelaporan keuangan'),
  ('Perhotelan', 'Hotel', 'Program keahlian yang mempelajari layanan dan manajemen perhotelan')
ON CONFLICT DO NOTHING;

-- Seed example students (4 per jurusan) and one skill record each so UI shows "top" students
-- Use safe INSERTs that don't duplicate existing names for the same jurusan

-- Teknik Mesin
WITH jm AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Mesin')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Raka Aji', 'XII-A', jm.id FROM jm WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Raka Aji' AND jurusan_id = jm.id);
WITH jm2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Mesin')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Dewi Susanti', 'XII-A', jm2.id FROM jm2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Dewi Susanti' AND jurusan_id = jm2.id);
WITH jm3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Mesin')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Budi Santoso', 'XII-B', jm3.id FROM jm3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Budi Santoso' AND jurusan_id = jm3.id);
WITH jm4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Mesin')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Siti Nurhayati', 'XII-C', jm4.id FROM jm4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Siti Nurhayati' AND jurusan_id = jm4.id);

-- Teknik Kendaraan Ringan
WITH jk1 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Agus Rahman', 'XII-A', jk1.id FROM jk1 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Agus Rahman' AND jurusan_id = jk1.id);
WITH jk2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Intan Maharani', 'XII-A', jk2.id FROM jk2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Intan Maharani' AND jurusan_id = jk2.id);
WITH jk3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Fikri Hidayat', 'XII-B', jk3.id FROM jk3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Fikri Hidayat' AND jurusan_id = jk3.id);
WITH jk4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kendaraan Ringan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Maya Putri', 'XII-C', jk4.id FROM jk4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Maya Putri' AND jurusan_id = jk4.id);

-- Teknik Sepeda Motor
WITH jmtr1 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rizky Pratama', 'XII-A', jmtr1.id FROM jmtr1 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rizky Pratama' AND jurusan_id = jmtr1.id);
WITH jmtr2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Yulia Sari', 'XII-A', jmtr2.id FROM jmtr2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Yulia Sari' AND jurusan_id = jmtr2.id);
WITH jmtr3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Deni Prasetyo', 'XII-B', jmtr3.id FROM jmtr3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Deni Prasetyo' AND jurusan_id = jmtr3.id);
WITH jmtr4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Sepeda Motor')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rina Kurnia', 'XII-C', jmtr4.id FROM jmtr4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rina Kurnia' AND jurusan_id = jmtr4.id);

-- Teknik Elektronika Industri
WITH je1 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Hendra Wijaya', 'XII-A', je1.id FROM je1 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Hendra Wijaya' AND jurusan_id = je1.id);
WITH je2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Siska Lestari', 'XII-B', je2.id FROM je2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Siska Lestari' AND jurusan_id = je2.id);
WITH je3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Gilang Pradipta', 'XII-B', je3.id FROM je3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Gilang Pradipta' AND jurusan_id = je3.id);
WITH je4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Elektronika Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Nadia Amelia', 'XII-C', je4.id FROM je4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Nadia Amelia' AND jurusan_id = je4.id);

-- Teknik Instalasi Tenaga Listrik
WITH jl1 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Taufik Hidayat', 'XII-A', jl1.id FROM jl1 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Taufik Hidayat' AND jurusan_id = jl1.id);
WITH jl2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Lia Ramadhani', 'XII-B', jl2.id FROM jl2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Lia Ramadhani' AND jurusan_id = jl2.id);
WITH jl3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Wahyu Kurnia', 'XII-B', jl3.id FROM jl3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Wahyu Kurnia' AND jurusan_id = jl3.id);
WITH jl4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Instalasi Tenaga Listrik')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rahayu Indah', 'XII-C', jl4.id FROM jl4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rahayu Indah' AND jurusan_id = jl4.id);

-- Teknik Kimia Industri
WITH jkimi1 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kimia Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Arif Maulana', 'XII-A', jkimi1.id FROM jkimi1 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Arif Maulana' AND jurusan_id = jkimi1.id);
WITH jkimi2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kimia Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Putri Ananda', 'XII-A', jkimi2.id FROM jkimi2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Putri Ananda' AND jurusan_id = jkimi2.id);
WITH jkimi3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kimia Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Hendra Saputra', 'XII-B', jkimi3.id FROM jkimi3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Hendra Saputra' AND jurusan_id = jkimi3.id);
WITH jkimi4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Teknik Kimia Industri')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Megawati', 'XII-C', jkimi4.id FROM jkimi4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Megawati' AND jurusan_id = jkimi4.id);

-- Akuntansi
WITH ja1 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Akuntansi')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Daniel Pratama', 'XII-A', ja1.id FROM ja1 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Daniel Pratama' AND jurusan_id = ja1.id);
WITH ja2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Akuntansi')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Nur Fadilah', 'XII-A', ja2.id FROM ja2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Nur Fadilah' AND jurusan_id = ja2.id);
WITH ja3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Akuntansi')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rian Setiawan', 'XII-B', ja3.id FROM ja3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rian Setiawan' AND jurusan_id = ja3.id);
WITH ja4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Akuntansi')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Sari Melati', 'XII-C', ja4.id FROM ja4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Sari Melati' AND jurusan_id = ja4.id);

-- Perhotelan
WITH ph1 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Perhotelan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Kevin Alexander', 'XII-A', ph1.id FROM ph1 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Kevin Alexander' AND jurusan_id = ph1.id);
WITH ph2 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Perhotelan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Mita Sari', 'XII-A', ph2.id FROM ph2 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Mita Sari' AND jurusan_id = ph2.id);
WITH ph3 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Perhotelan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Fajar Prakoso', 'XII-B', ph3.id FROM ph3 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Fajar Prakoso' AND jurusan_id = ph3.id);
WITH ph4 AS (SELECT id FROM jurusan WHERE nama_jurusan = 'Perhotelan')
INSERT INTO siswa (nama, kelas, jurusan_id)
SELECT 'Rani Melinda', 'XII-C', ph4.id FROM ph4 WHERE NOT EXISTS (SELECT 1 FROM siswa WHERE nama = 'Rani Melinda' AND jurusan_id = ph4.id);

-- Insert skill records (one per student) with scores so the top student is clear per jurusan
-- Note: assign skor values to map to levels already created; skip if skill record exists

-- Teknik Mesin: Raka Aji top (98)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 98 FROM siswa s
JOIN level_skill l ON 98 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Raka Aji' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 84 FROM siswa s
JOIN level_skill l ON 84 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Dewi Susanti' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 71 FROM siswa s
JOIN level_skill l ON 71 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Budi Santoso' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 60 FROM siswa s
JOIN level_skill l ON 60 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Siti Nurhayati' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Kendaraan Ringan: Agus Rahman top (95)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 95 FROM siswa s
JOIN level_skill l ON 95 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Agus Rahman' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 82 FROM siswa s
JOIN level_skill l ON 82 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Intan Maharani' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 64 FROM siswa s
JOIN level_skill l ON 64 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Fikri Hidayat' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 45 FROM siswa s
JOIN level_skill l ON 45 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Maya Putri' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Sepeda Motor: Rizky Pratama top (96)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 96 FROM siswa s
JOIN level_skill l ON 96 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Rizky Pratama' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 79 FROM siswa s
JOIN level_skill l ON 79 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Yulia Sari' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 58 FROM siswa s
JOIN level_skill l ON 58 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Deni Prasetyo' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 33 FROM siswa s
JOIN level_skill l ON 33 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Rina Kurnia' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Elektronika Industri: Hendra Wijaya top (93)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 93 FROM siswa s
JOIN level_skill l ON 93 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Hendra Wijaya' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 77 FROM siswa s
JOIN level_skill l ON 77 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Siska Lestari' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 54 FROM siswa s
JOIN level_skill l ON 54 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Gilang Pradipta' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 29 FROM siswa s
JOIN level_skill l ON 29 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Nadia Amelia' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Instalasi Tenaga Listrik: Taufik Hidayat top (97)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 97 FROM siswa s
JOIN level_skill l ON 97 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Taufik Hidayat' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 86 FROM siswa s
JOIN level_skill l ON 86 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Lia Ramadhani' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 69 FROM siswa s
JOIN level_skill l ON 69 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Wahyu Kurnia' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 52 FROM siswa s
JOIN level_skill l ON 52 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Rahayu Indah' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Teknik Kimia Industri: Arif Maulana top (94)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 94 FROM siswa s
JOIN level_skill l ON 94 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Arif Maulana' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 81 FROM siswa s
JOIN level_skill l ON 81 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Putri Ananda' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 65 FROM siswa s
JOIN level_skill l ON 65 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Hendra Saputra' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 38 FROM siswa s
JOIN level_skill l ON 38 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Megawati' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Akuntansi: Daniel Pratama top (92)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 92 FROM siswa s
JOIN level_skill l ON 92 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Daniel Pratama' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 80 FROM siswa s
JOIN level_skill l ON 80 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Nur Fadilah' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 63 FROM siswa s
JOIN level_skill l ON 63 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Rian Setiawan' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 49 FROM siswa s
JOIN level_skill l ON 49 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Sari Melati' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

-- Perhotelan: Kevin Alexander top (90)
INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 90 FROM siswa s
JOIN level_skill l ON 90 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Kevin Alexander' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 76 FROM siswa s
JOIN level_skill l ON 76 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Mita Sari' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 59 FROM siswa s
JOIN level_skill l ON 59 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Fajar Prakoso' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);

INSERT INTO skill_siswa (siswa_id, level_id, skor)
SELECT s.id, l.id, 42 FROM siswa s
JOIN level_skill l ON 42 BETWEEN l.min_skor AND l.max_skor
WHERE s.nama = 'Rani Melinda' AND NOT EXISTS (SELECT 1 FROM skill_siswa ss WHERE ss.siswa_id = s.id);