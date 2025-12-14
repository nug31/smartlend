import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import mockData from '../mocks/mockData';
import type { Jurusan } from '../types';
import { JurusanCard } from './JurusanCard';
import { DashboardRace } from './DashboardRace';
import { useAuth } from '../contexts/AuthContext';

interface HomePageProps {
  onSelectJurusan: (jurusan: Jurusan) => void;
}

export function HomePage({ onSelectJurusan }: HomePageProps) {
  const { user } = useAuth();
  const [jurusanList, setJurusanList] = useState<Jurusan[]>([]);
  const [topStudentsMap, setTopStudentsMap] = useState<Record<string, { id: string; nama: string; skor: number; kelas?: string }[]>>({});
  const [raceData, setRaceData] = useState<Array<{ jurusan: Jurusan; averageSkor: number; studentCount: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [triggerRace, setTriggerRace] = useState(0);

  const useMock = import.meta.env.VITE_USE_MOCK === 'true';

  useEffect(() => {
    loadJurusan();
  }, [user]);

  async function loadJurusan() {
    try {
      let data: Jurusan[] | null = null;
      if (useMock) {
        data = mockData.mockJurusan;
      } else {
        const result = await supabase.from('jurusan').select('*').order('nama_jurusan');
        if (result.error) throw result.error;
        data = result.data || [];
      }

      // Filter by jurusan if student
      if (user?.role === 'student' && user.jurusan_id && data) {
        data = data.filter(j => j.id === user.jurusan_id);
      }

      setJurusanList(data || []);

      // fetch top student for each jurusan (best skor)
      try {
        const map: Record<string, { id: string; nama: string; skor: number; kelas?: string }[]> = {};
        if (useMock) {
          (data || []).forEach((j) => {
            map[j.id] = mockData.getTopStudentsForJurusan(j.id, 3);
          });
        } else {
          await Promise.all((data || []).map(async (j) => {
            const { data: topData, error } = await supabase
              .from('skill_siswa')
              .select('skor, siswa(id, nama, kelas)')
              .eq('siswa.jurusan_id', j.id)
              .order('skor', { ascending: false })
              .limit(3);

            if (!error && topData && topData.length > 0) {
              map[j.id] = (topData as any[]).map((t) => ({ id: t.siswa?.id ?? '', nama: t.siswa?.nama ?? 'N/A', skor: t.skor ?? 0, kelas: t.siswa?.kelas }));
            } else {
              map[j.id] = [];
            }
          }));
        }

        setTopStudentsMap(map);
      } catch (e) {
        console.error('Error loading top students:', e);
      }

      // Load race data (average scores per jurusan)
      try {
        if (useMock) {
          const avgData = mockData.getAllJurusanWithAverageSkors();
          const raceList = avgData.map((avg) => {
            const jurusan = (data || []).find((j) => j.id === avg.jurusanId);
            return jurusan ? {
              jurusan,
              averageSkor: avg.averageSkor,
              studentCount: avg.studentCount,
            } : null;
          }).filter(Boolean) as Array<{ jurusan: Jurusan; averageSkor: number; studentCount: number }>;
          setRaceData(raceList);
        } else {
          // For real database, calculate average scores
          const raceList = await Promise.all((data || []).map(async (j) => {
            const { data: skillData } = await supabase
              .from('skill_siswa')
              .select('skor, siswa(jurusan_id)')
              .eq('siswa.jurusan_id', j.id);

            const scores = (skillData || []).map((s: any) => s.skor).filter(Boolean);
            const averageSkor = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;

            return {
              jurusan: j,
              averageSkor,
              studentCount: scores.length,
            };
          }));
          setRaceData(raceList);
        }
      } catch (e) {
        console.error('Error loading race data:', e);
      }
    } catch (error) {
      console.error('Error loading jurusan:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fadeInUp">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-blue-400 shadow-md-2">
                <GraduationCap className="w-5 h-5 text-white" />
                <span className="text-white text-xs font-semibold">DASHBOARD</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight text-white drop-shadow-xl tracking-tight">
                  SKILL PASSPORT
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white/90 tracking-wide uppercase">
                  SMK MITRA INDUSTRI MM2100
                </h2>
                <div className="w-24 h-1.5 bg-yellow-400 rounded-full mt-4 mb-6"></div>
                <p className="text-lg sm:text-xl text-white/80 font-medium">
                  Menuju Vokasi Berstandar Industri & Terverifikasi
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-8">
                <button
                  onClick={() => {
                    setTriggerRace(Date.now());
                    const raceSection = document.getElementById('dashboard-race');
                    raceSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg font-semibold shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all w-full sm:w-auto text-sm sm:text-base"
                >
                  Mulai
                </button>

              </div>
            </div>

            <div className="card-glass rounded-xl-2 p-6 shadow-inner border border-white/6 animate-slideInRight stagger-delay-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm text-white/70">Overview</div>
                  <div className="text-2xl font-bold">8 Jurusan • 32 Siswa aktif</div>
                </div>
                <div className="text-sm text-white/60">Terakhir diperbarui: Hari ini</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/6">
                  <div className="text-xs text-white/70">Top Jurusan</div>
                  <div className="text-sm font-semibold mt-2">Teknik Mesin</div>
                </div>
                <div className="p-3 bg-gradient-to-r from-white/5 to-transparent rounded-lg border border-white/6">
                  <div className="text-xs text-white/70">Average Skor</div>
                  <div className="text-sm font-semibold mt-2">84.6</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Race Recap */}
        {!loading && raceData.length > 0 && (
          <div id="dashboard-race" className="animate-fadeIn stagger-delay-3 pb-12">
            <DashboardRace jurusanData={raceData} trigger={triggerRace} />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {jurusanList.map((jurusan, index) => (
              <div className="pulse-on-hover animate-fadeInUp" style={{ animationDelay: `${index * 100 + 400}ms` }}>
                <JurusanCard
                  key={jurusan.id}
                  jurusan={jurusan}
                  onClick={() => onSelectJurusan(jurusan)}
                  topStudents={topStudentsMap[jurusan.id] ?? []}
                />
              </div>
            ))}
          </div>
        )}

        {!loading && jurusanList.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Tidak ada data jurusan</p>
          </div>
        )}
      </div>
    </div>
  );
}
