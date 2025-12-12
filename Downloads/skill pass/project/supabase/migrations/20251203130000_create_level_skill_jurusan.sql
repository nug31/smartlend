-- Create table to store jurusan-specific overrides for level descriptions
CREATE TABLE IF NOT EXISTS level_skill_jurusan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jurusan_id uuid NOT NULL REFERENCES jurusan(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES level_skill(id) ON DELETE CASCADE,
  hasil_belajar text DEFAULT '',
  soft_skill text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT uq_level_jurusan UNIQUE (jurusan_id, level_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_level_skill_jurusan_jurusan ON level_skill_jurusan(jurusan_id);
CREATE INDEX IF NOT EXISTS idx_level_skill_jurusan_level ON level_skill_jurusan(level_id);

-- Row-level security
ALTER TABLE level_skill_jurusan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view level_skill_jurusan"
  ON level_skill_jurusan FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert level_skill_jurusan"
  ON level_skill_jurusan FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update level_skill_jurusan"
  ON level_skill_jurusan FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
