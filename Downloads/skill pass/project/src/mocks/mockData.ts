import type { Jurusan, LevelSkill, Siswa, SkillSiswa, StudentListItem } from '../types';

// Minimal mock data to use while developing locally (VITE_USE_MOCK=true)

export const mockLevels: LevelSkill[] = [
  {
    id: 'lvl-basic',
    nama_level: 'Pemula / Beginner',
    urutan: 1,
    min_skor: 0,
    max_skor: 25,
    badge_color: '#94a3b8',
    badge_name: 'Basic',
    hasil_belajar: 'Memahami konsep dasar',
    soft_skill: 'Komunikasi dasar',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lvl-inter',
    nama_level: 'Intermediate',
    urutan: 2,
    min_skor: 26,
    max_skor: 50,
    badge_color: '#3b82f6',
    badge_name: 'Applied',
    hasil_belajar: 'Mampu menerapkan pengetahuan',
    soft_skill: 'Problem solving',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lvl-adv',
    nama_level: 'Advanced',
    urutan: 3,
    min_skor: 51,
    max_skor: 75,
    badge_color: '#f59e0b',
    badge_name: 'Advance',
    hasil_belajar: 'Menguasai keterampilan kompleks',
    soft_skill: 'Kepemimpinan',
    created_at: new Date().toISOString(),
  },
  {
    id: 'lvl-master',
    nama_level: 'Mastery',
    urutan: 4,
    min_skor: 76,
    max_skor: 100,
    badge_color: '#10b981',
    badge_name: 'Master',
    hasil_belajar: 'Ahli dalam bidangnya',
    soft_skill: 'Mentoring',
    created_at: new Date().toISOString(),
  },
];

export const mockJurusan: Jurusan[] = [
  { id: 'j1', nama_jurusan: 'Teknik Mesin', icon: 'Settings', deskripsi: 'Perancangan dan perawatan mesin', created_at: new Date().toISOString() },
  { id: 'j2', nama_jurusan: 'Teknik Kendaraan Ringan', icon: 'Car', deskripsi: 'Perawatan kendaraan ringan', created_at: new Date().toISOString() },
  { id: 'j3', nama_jurusan: 'Teknik Sepeda Motor', icon: 'Bike', deskripsi: 'Perbaikan sepeda motor', created_at: new Date().toISOString() },
  { id: 'j4', nama_jurusan: 'Teknik Elektronika Industri', icon: 'Cpu', deskripsi: 'Elektronika & otomasi', created_at: new Date().toISOString() },
  { id: 'j5', nama_jurusan: 'Teknik Instalasi Tenaga Listrik', icon: 'Zap', deskripsi: 'Instalasi kelistrikan', created_at: new Date().toISOString() },
  { id: 'j6', nama_jurusan: 'Teknik Kimia Industri', icon: 'FlaskConical', deskripsi: 'Proses produksi kimia', created_at: new Date().toISOString() },
  { id: 'j7', nama_jurusan: 'Akuntansi', icon: 'Calculator', deskripsi: 'Pencatatan keuangan', created_at: new Date().toISOString() },
  { id: 'j8', nama_jurusan: 'Perhotelan', icon: 'Hotel', deskripsi: 'Layanan & manajemen hotel', created_at: new Date().toISOString() },
];

// Class pools (by jurusan id) — used for generating random 'kelas' values for mock students
const classPools: Record<string, string[]> = {
  j1: Array.from({ length: 6 }, (_, i) => `X MESIN ${i + 1}`), // Teknik Mesin -> X MESIN 1-6
  j2: Array.from({ length: 6 }, (_, i) => `X TKR ${i + 1}`), // Teknik Kendaraan Ringan -> X TKR 1-6
  j3: Array.from({ length: 6 }, (_, i) => `X TSM ${i + 1}`), // Teknik Sepeda Motor -> X TSM 1-6
  j4: Array.from({ length: 12 }, (_, i) => `ELIND ${i + 1}`), // Elektronika Industri -> ELIND 1-12
  j5: Array.from({ length: 4 }, (_, i) => `X LISTRIK ${i + 1}`), // Teknik Instalasi Tenaga Listrik -> X LISTRIK 1-4
  j6: Array.from({ length: 6 }, (_, i) => `X TKI ${i + 1}`), // Teknik Kimia Industri -> X TKI 1-6
  j7: Array.from({ length: 4 }, (_, i) => `X AK ${i + 1}`), // Akuntansi -> X AK 1-4
  j8: Array.from({ length: 4 }, (_, i) => `X HOTEL ${i + 1}`), // Perhotelan -> X HOTEL 1-4
};

function pickRandom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function klassFor(jurusanId: string) {
  const pool = classPools[jurusanId] || ['X'];
  return pickRandom(pool);
}

// Example students and scores (one score each so UI has a "latest skill" record)
export const mockSiswa: Siswa[] = [
  { id: 's-j1-a', nama: 'Raka Aji', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },
  { id: 's-j1-b', nama: 'Dewi Susanti', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },
  { id: 's-j1-c', nama: 'Budi Santoso', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },
  { id: 's-j1-d', nama: 'Siti Nurhayati', kelas: klassFor('j1'), jurusan_id: 'j1', created_at: new Date().toISOString() },

  { id: 's-j2-a', nama: 'Agus Rahman', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },
  { id: 's-j2-b', nama: 'Intan Maharani', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },
  { id: 's-j2-c', nama: 'Fikri Hidayat', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },
  { id: 's-j2-d', nama: 'Maya Putri', kelas: klassFor('j2'), jurusan_id: 'j2', created_at: new Date().toISOString() },

  { id: 's-j3-a', nama: 'Rizky Pratama', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },
  { id: 's-j3-b', nama: 'Yulia Sari', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },
  { id: 's-j3-c', nama: 'Deni Prasetyo', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },
  { id: 's-j3-d', nama: 'Rina Kurnia', kelas: klassFor('j3'), jurusan_id: 'j3', created_at: new Date().toISOString() },

  { id: 's-j4-a', nama: 'Hendra Wijaya', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },
  { id: 's-j4-b', nama: 'Siska Lestari', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },
  { id: 's-j4-c', nama: 'Gilang Pradipta', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },
  { id: 's-j4-d', nama: 'Nadia Amelia', kelas: klassFor('j4'), jurusan_id: 'j4', created_at: new Date().toISOString() },

  { id: 's-j5-a', nama: 'Taufik Hidayat', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },
  { id: 's-j5-b', nama: 'Lia Ramadhani', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },
  { id: 's-j5-c', nama: 'Wahyu Kurnia', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },
  { id: 's-j5-d', nama: 'Rahayu Indah', kelas: klassFor('j5'), jurusan_id: 'j5', created_at: new Date().toISOString() },

  { id: 's-j6-a', nama: 'Arif Maulana', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },
  { id: 's-j6-b', nama: 'Putri Ananda', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },
  { id: 's-j6-c', nama: 'Hendra Saputra', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },
  { id: 's-j6-d', nama: 'Megawati', kelas: klassFor('j6'), jurusan_id: 'j6', created_at: new Date().toISOString() },

  { id: 's-j7-a', nama: 'Daniel Pratama', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },
  { id: 's-j7-b', nama: 'Nur Fadilah', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },
  { id: 's-j7-c', nama: 'Rian Setiawan', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },
  { id: 's-j7-d', nama: 'Sari Melati', kelas: klassFor('j7'), jurusan_id: 'j7', created_at: new Date().toISOString() },

  { id: 's-j8-a', nama: 'Kevin Alexander', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
  { id: 's-j8-b', nama: 'Mita Sari', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
  { id: 's-j8-c', nama: 'Fajar Prakoso', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
  { id: 's-j8-d', nama: 'Rani Melinda', kelas: klassFor('j8'), jurusan_id: 'j8', created_at: new Date().toISOString() },
];

export const mockSkillSiswa: SkillSiswa[] = [
  { id: 'ss-raka', siswa_id: 's-j1-a', level_id: 'lvl-master', skor: 98, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-dewi', siswa_id: 's-j1-b', level_id: 'lvl-adv', skor: 84, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-budi', siswa_id: 's-j1-c', level_id: 'lvl-adv', skor: 71, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siti', siswa_id: 's-j1-d', level_id: 'lvl-adv', skor: 60, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-agus', siswa_id: 's-j2-a', level_id: 'lvl-master', skor: 95, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-intan', siswa_id: 's-j2-b', level_id: 'lvl-adv', skor: 82, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-fikri', siswa_id: 's-j2-c', level_id: 'lvl-adv', skor: 64, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-maya', siswa_id: 's-j2-d', level_id: 'lvl-inter', skor: 45, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-rizky', siswa_id: 's-j3-a', level_id: 'lvl-master', skor: 96, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-yulia', siswa_id: 's-j3-b', level_id: 'lvl-master', skor: 79, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-deni', siswa_id: 's-j3-c', level_id: 'lvl-adv', skor: 58, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rina', siswa_id: 's-j3-d', level_id: 'lvl-inter', skor: 33, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-hendra', siswa_id: 's-j4-a', level_id: 'lvl-master', skor: 93, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-siska', siswa_id: 's-j4-b', level_id: 'lvl-master', skor: 77, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-gilang', siswa_id: 's-j4-c', level_id: 'lvl-adv', skor: 54, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-nadia', siswa_id: 's-j4-d', level_id: 'lvl-inter', skor: 29, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-taufik', siswa_id: 's-j5-a', level_id: 'lvl-master', skor: 97, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-lia', siswa_id: 's-j5-b', level_id: 'lvl-master', skor: 86, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-wahyu', siswa_id: 's-j5-c', level_id: 'lvl-adv', skor: 69, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rahayu', siswa_id: 's-j5-d', level_id: 'lvl-adv', skor: 52, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-arif', siswa_id: 's-j6-a', level_id: 'lvl-master', skor: 94, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-putri', siswa_id: 's-j6-b', level_id: 'lvl-master', skor: 81, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-hendra2', siswa_id: 's-j6-c', level_id: 'lvl-adv', skor: 65, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-megawati', siswa_id: 's-j6-d', level_id: 'lvl-inter', skor: 38, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-daniel', siswa_id: 's-j7-a', level_id: 'lvl-master', skor: 92, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-nur', siswa_id: 's-j7-b', level_id: 'lvl-master', skor: 80, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rian', siswa_id: 's-j7-c', level_id: 'lvl-adv', skor: 63, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-sari', siswa_id: 's-j7-d', level_id: 'lvl-inter', skor: 49, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  { id: 'ss-kevin', siswa_id: 's-j8-a', level_id: 'lvl-master', skor: 90, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-mita', siswa_id: 's-j8-b', level_id: 'lvl-master', skor: 76, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-fajar', siswa_id: 's-j8-c', level_id: 'lvl-adv', skor: 59, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'ss-rani', siswa_id: 's-j8-d', level_id: 'lvl-inter', skor: 42, tanggal_pencapaian: new Date().toISOString(), created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

// per-jurusan overrides for level descriptions
export const mockLevelOverrides: Array<{ jurusan_id: string; level_id: string; hasil_belajar?: string; soft_skill?: string }> = [
  { jurusan_id: 'j1', level_id: 'lvl-master', hasil_belajar: 'Mahir merancang dan merawat sistem mekanik tingkat lanjut', soft_skill: 'Kepemimpinan teknis' },
  { jurusan_id: 'j4', level_id: 'lvl-adv', hasil_belajar: 'Mampu merancang sirkuit kontrol dan mengoperasikan PLC', soft_skill: 'Analisis sistem' },
];

export function getTopStudentForJurusan(jurusanId: string): { nama: string; skor: number; kelas?: string } | null {
  const students = mockSiswa.filter((s) => s.jurusan_id === jurusanId);
  if (students.length === 0) return null;
  // find highest skor from mockSkillSiswa
  let top: { nama: string; skor: number; kelas?: string } | null = null;
  students.forEach((s) => {
    const sk = mockSkillSiswa.find((r) => r.siswa_id === s.id);
    if (!sk) return;
    if (!top || sk.skor > top.skor) top = { nama: s.nama, skor: sk.skor, kelas: s.kelas };
  });
  return top;
}

export function getTopStudentsForJurusan(jurusanId: string, count = 3): { id: string; nama: string; skor: number; kelas?: string }[] {
  const list = getStudentListForJurusan(jurusanId);
  return list.sort((a, b) => b.skor - a.skor).slice(0, count).map((s) => ({ id: s.id, nama: s.nama, skor: s.skor, kelas: s.kelas }));
}

export function getStudentListForJurusan(jurusanId: string): StudentListItem[] {
  const levels = mockLevels;
  const students = mockSiswa.filter((s) => s.jurusan_id === jurusanId);

  return students
    .map((s) => {
      const sk = mockSkillSiswa.find((r) => r.siswa_id === s.id);
      if (!sk) return null;
      const level = levels.find((l) => sk.skor >= l.min_skor && sk.skor <= l.max_skor);
      const badge_name = (level?.badge_name ?? 'Basic') as any;
      const badge_color = level?.badge_color ?? '#94a3b8';
      const level_name = level?.nama_level ?? 'Pemula / Beginner';

      return {
        id: s.id,
        nama: s.nama,
        kelas: s.kelas,
        skor: sk.skor,
        badge_name,
        badge_color,
        level_name,
      } as StudentListItem;
    })
    .filter(Boolean) as StudentListItem[];
}

export function getLevelsForJurusan(jurusanId: string) {
  // merge mockLevels with any overrides for this jurusan
  return mockLevels.map((lvl) => {
    const ov = mockLevelOverrides.find((o) => o.jurusan_id === jurusanId && o.level_id === lvl.id);
    return {
      ...lvl,
      hasil_belajar: ov?.hasil_belajar ?? lvl.hasil_belajar,
      soft_skill: ov?.soft_skill ?? lvl.soft_skill,
    };
  });
}

export function getAverageSkorForJurusan(jurusanId: string): number {
  const students = mockSiswa.filter((s) => s.jurusan_id === jurusanId);
  if (students.length === 0) return 0;

  let totalSkor = 0;
  let count = 0;

  students.forEach((s) => {
    const sk = mockSkillSiswa.find((r) => r.siswa_id === s.id);
    if (sk) {
      totalSkor += sk.skor;
      count++;
    }
  });

  return count > 0 ? totalSkor / count : 0;
}

export function getAllJurusanWithAverageSkors(): Array<{ jurusanId: string; averageSkor: number; studentCount: number }> {
  return mockJurusan.map((j) => {
    const students = mockSiswa.filter((s) => s.jurusan_id === j.id);
    const averageSkor = getAverageSkorForJurusan(j.id);
    return {
      jurusanId: j.id,
      averageSkor,
      studentCount: students.length,
    };
  });
}

export default {
  mockLevels,
  mockJurusan,
  mockSiswa,
  mockSkillSiswa,
  mockLevelOverrides,
  getTopStudentForJurusan,
  getTopStudentsForJurusan,
  getStudentListForJurusan,
  getLevelsForJurusan,
  getAverageSkorForJurusan,
  getAllJurusanWithAverageSkors,
};
