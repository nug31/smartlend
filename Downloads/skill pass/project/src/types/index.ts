import type { Database } from './database';

export type Jurusan = Database['public']['Tables']['jurusan']['Row'];
export type LevelSkill = Database['public']['Tables']['level_skill']['Row'];
export type Siswa = Database['public']['Tables']['siswa']['Row'];
export type SkillSiswa = Database['public']['Tables']['skill_siswa']['Row'];

export interface SiswaWithSkill extends Siswa {
  skill_siswa: SkillSiswa[];
  current_level?: LevelSkill;
  current_skor?: number;
}

export interface JurusanWithStats extends Jurusan {
  total_siswa?: number;
}

export type BadgeLevel = 'Basic' | 'Applied' | 'Advance' | 'Master';

export interface StudentListItem {
  id: string;
  nama: string;
  kelas: string;
  skor: number;
  badge_name: BadgeLevel;
  badge_color: string;
  level_name: string;
}

export interface RaceParticipant {
  id: string;
  name: string;
  score: number;
  label: string;
  secondaryLabel?: string;
  icon?: string;
  color?: string;
  rank?: number;
  badge_name?: string;
  alias?: string;
}
