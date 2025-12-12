import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { supabase } from '../lib/supabase';
import mockData from '../mocks/mockData';
import type { Jurusan, LevelSkill, StudentListItem } from '../types';
import { LevelTable } from './LevelTable';
import formatClassLabel from '../lib/formatJurusan';
import ImportStudents from './ImportStudents';
import { StudentTable } from './StudentTable';
import StudentDetailModal from './StudentDetailModal';
import { StudentRace } from './StudentRace';
import { useAuth } from '../contexts/AuthContext';

interface JurusanDetailPageProps {
  jurusan: Jurusan;
  onBack: () => void;
}

export function JurusanDetailPage({ jurusan, onBack }: JurusanDetailPageProps) {
  const { isTeacher } = useAuth();
  const [levels, setLevels] = useState<LevelSkill[]>([]);
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showImport, setShowImport] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);

  const IconComponent = (LucideIcons as any)[jurusan.icon] || LucideIcons.GraduationCap;

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [jurusan.id]);

  async function loadData() {
    try {
      setLoading(true);

      const useMock = import.meta.env.VITE_USE_MOCK === 'true';

      if (useMock) {
        // Read from mockData (merged per-jurusan overrides)
        setLevels(mockData.getLevelsForJurusan(jurusan.id));
        const list = mockData.getStudentListForJurusan(jurusan.id);
        setStudents(list);
        setLoading(false);
        return;
      }

      const [levelsResult, studentsResult] = await Promise.all([
        supabase.from('level_skill').select('*').order('urutan'),
        supabase
          .from('siswa')
          .select('id, nama, kelas, skill_siswa(skor, level_id)')
          .eq('jurusan_id', jurusan.id),
      ]);

      if (levelsResult.error) throw levelsResult.error;
      if (studentsResult.error) throw studentsResult.error;

      // ensure the Supabase result is treated as LevelSkill[] so the typechecker is happy
      const levelsData = (levelsResult.data || []) as LevelSkill[];
      setLevels(levelsData);

      const levelsMap = new Map(
        levelsData.map((level: LevelSkill) => [level.id, level])
      );

      const studentList: StudentListItem[] = (studentsResult.data || [])
        .filter((siswa: any) => siswa.skill_siswa && siswa.skill_siswa.length > 0)
        .map((siswa: any) => {
          const latestSkill = siswa.skill_siswa[0];
          const level = levelsMap.get(latestSkill.level_id);

          let badge_name = 'Basic';
          let badge_color = '#94a3b8';
          let level_name = 'Pemula / Beginner';

          if (level) {
            badge_name = level.badge_name;
            badge_color = level.badge_color;
            level_name = level.nama_level;
          } else {
            const skor = latestSkill.skor;
            if (skor >= 76) {
              badge_name = 'Master';
              badge_color = '#10b981';
              level_name = 'Mastery';
            } else if (skor >= 51) {
              badge_name = 'Advance';
              badge_color = '#f59e0b';
              level_name = 'Advanced';
            } else if (skor >= 26) {
              badge_name = 'Applied';
              badge_color = '#3b82f6';
              level_name = 'Intermediate';
            }
          }

          return {
            id: siswa.id,
            nama: siswa.nama,
            kelas: siswa.kelas,
            skor: latestSkill.skor,
            badge_name: badge_name as any,
            badge_color,
            level_name,
          };
        });

      setStudents(studentList);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditScore(siswaId: string, newSkor: number) {
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';
    try {
      setLoading(true);

      if (useMock) {
        // mutate mock data in memory and update students state
        const idx = mockData.mockSkillSiswa.findIndex((r) => r.siswa_id === siswaId);
        if (idx >= 0) {
          mockData.mockSkillSiswa[idx].skor = newSkor;
          mockData.mockSkillSiswa[idx].updated_at = new Date().toISOString();
        } else {
          mockData.mockSkillSiswa.push({
            id: `ss-${siswaId}-${Date.now()}`,
            siswa_id: siswaId,
            level_id: (() => {
              const lev = mockData.mockLevels.find((l) => newSkor >= l.min_skor && newSkor <= l.max_skor);
              return lev?.id ?? mockData.mockLevels[0].id;
            })(),
            skor: newSkor,
            tanggal_pencapaian: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        // refresh students from mockData
        const list = mockData.getStudentListForJurusan(jurusan.id);
        setStudents(list);
        return;
      }

      // determine level id based on current levels
      const level = levels.find((l) => newSkor >= l.min_skor && newSkor <= l.max_skor);
      const levelId = level ? level.id : levels[0]?.id;

      const { error } = await supabase.from('skill_siswa').insert({ siswa_id: siswaId, level_id: levelId, skor: newSkor });
      if (error) throw error;

      // refresh
      await loadData();
    } catch (err) {
      console.error('Error saving score:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateHasil(levelId: string, newHasil: string) {
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';
    try {
      setLoading(true);

      if (useMock) {
        // find existing override
        const idx = mockData.mockLevelOverrides.findIndex((o) => o.jurusan_id === jurusan.id && o.level_id === levelId);
        if (idx >= 0) {
          mockData.mockLevelOverrides[idx].hasil_belajar = newHasil;
        } else {
          mockData.mockLevelOverrides.push({ jurusan_id: jurusan.id, level_id: levelId, hasil_belajar: newHasil });
        }

        setLevels(mockData.getLevelsForJurusan(jurusan.id));
        return;
      }

      // upsert into new table level_skill_jurusan
      const { error } = await supabase
        .from('level_skill_jurusan')
        .upsert({ jurusan_id: jurusan.id, level_id: levelId, hasil_belajar: newHasil }, { onConflict: 'jurusan_id,level_id' });
      if (error) throw error;

      // refresh
      await loadData();
    } catch (err) {
      console.error('Error updating hasil_belajar:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const filteredStudents = selectedLevel === 'all'
    ? students
    : students.filter((s) => {
      const level = levels.find((l) => l.id === selectedLevel);
      return level && s.skor >= level.min_skor && s.skor <= level.max_skor;
    });

  // compute ranks (1-based) for ALL students, sorted by score
  const topRanks: Record<string, number> = {};
  (() => {
    const sorted = [...students].sort((a, b) => b.skor - a.skor);
    sorted.forEach((s, idx) => { topRanks[s.id] = idx + 1; });
  })();

  const handleExportExcel = () => {
    const csvContent = [
      ['Nama Siswa', 'Kelas', 'Skor', 'Badge', 'Level'],
      ...filteredStudents.map((s) => [s.nama, formatClassLabel(jurusan.nama_jurusan, s.kelas), s.skor, s.badge_name, s.level_name]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${jurusan.nama_jurusan}_students.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    alert('Export PDF akan segera tersedia. Untuk sementara, gunakan fungsi Print Browser (Ctrl+P) dan pilih Save as PDF.');
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Beranda</span>
        </button>

        <div className="card-glass rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[color:var(--text-primary)] mb-2">
                {jurusan.nama_jurusan}
              </h1>
              <p className="text-[color:var(--text-muted)]">{jurusan.deskripsi}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-[color:var(--accent-1)]" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Student Race */}
            <StudentRace students={students} jurusanName={jurusan.nama_jurusan} />

            <LevelTable levels={levels} jurusanId={jurusan.id} onUpdateHasil={handleUpdateHasil} isTeacher={isTeacher} />

            <div className="card-glass rounded-xl shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">Daftar Siswa per Level</h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-[color:var(--text-muted)] whitespace-nowrap">
                    Filter Level:
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[color:var(--accent-1)] focus:border-transparent text-sm text-[color:var(--text-primary)] bg-[color:var(--card-bg)] border-[color:var(--card-border)]"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <option value="all" style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>Semua Level</option>
                    {levels.map((level) => (
                      <option key={level.id} value={level.id} style={{ backgroundColor: '#1e293b', color: '#ffffff' }}>
                        {level.nama_level} ({level.badge_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center gap-2 mb-4">
                <div />
                {isTeacher && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowImport(true)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm inline-flex items-center gap-2">
                      <span>Import Siswa</span>
                    </button>
                  </div>
                )}
              </div>

              <StudentTable
                students={filteredStudents}
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                onEditScore={isTeacher ? handleEditScore : undefined}
                topRanks={topRanks}
                onSelectStudent={(s) => setSelectedStudent(s)}
                jurusanName={jurusan.nama_jurusan}
              />

              {selectedStudent && (
                <StudentDetailModal student={selectedStudent} levels={levels} onClose={() => setSelectedStudent(null)} jurusanName={jurusan.nama_jurusan} />
              )}

              {showImport && (
                <ImportStudents jurusanId={jurusan.id} onClose={() => setShowImport(false)} onImported={() => loadData()} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
