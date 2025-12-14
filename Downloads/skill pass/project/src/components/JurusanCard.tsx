import * as LucideIcons from 'lucide-react';
import type { Jurusan } from '../types';

interface JurusanCardProps {
  jurusan: Jurusan;
  onClick: () => void;
  topStudents?: { id: string; nama: string; skor: number; kelas?: string }[];
}

function formatJurusanName(nama?: string): string {
  if (!nama) return '';
  const n = nama.toLowerCase().trim();

  // Match exact patterns for jurusan names from database
  // Map to full display names per requested list
  if (n.includes('mesin')) return 'Teknik Mesin';
  if (n.includes('kendaraan ringan') || n.includes('tkr')) return 'Teknik Kendaraan Ringan';
  if (n.includes('sepeda motor') || n.includes('tsm')) return 'Teknik Sepeda Motor';
  if (n.includes('elektronika') || n.includes('elind') || n.includes('elektronika industri')) return 'Elektronika Industri';
  if (n.includes('listrik') || n.includes('tenaga listrik') || n.includes('instalasi tenaga listrik')) return 'Teknik Instalasi Tenaga Listrik';
  if (n.includes('kimia')) return 'Teknik Kimia Industri';
  if (n.includes('akuntansi') || n.includes('akuntan')) return 'Akuntansi';
  if (n.includes('perhotelan') || n.includes('hotel')) return 'Perhotelan';

  return nama;
}

function getJurusanGradient(nama?: string): string {
  if (!nama) return 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500';
  const n = nama.toLowerCase().trim();

  if (n.includes('mesin')) return 'bg-gradient-to-br from-red-600 to-orange-500 shadow-red-500/20';
  if (n.includes('kendaraan') || n.includes('tkr')) return 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-blue-500/20';
  if (n.includes('sepeda') || n.includes('tsm')) return 'bg-gradient-to-br from-emerald-600 to-teal-500 shadow-emerald-500/20';
  if (n.includes('elektronika') || n.includes('elind')) return 'bg-gradient-to-br from-violet-600 to-fuchsia-500 shadow-violet-500/20';
  if (n.includes('listrik') || n.includes('tenaga')) return 'bg-gradient-to-br from-amber-500 to-yellow-500 shadow-amber-500/20';
  if (n.includes('kimia')) return 'bg-gradient-to-br from-pink-600 to-rose-500 shadow-pink-500/20';
  if (n.includes('akuntansi')) return 'bg-gradient-to-br from-green-600 to-emerald-600 shadow-green-500/20';
  if (n.includes('perhotelan')) return 'bg-gradient-to-br from-sky-500 to-blue-600 shadow-sky-500/20';

  return 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500';
}

export function JurusanCard({ jurusan, onClick, topStudents }: JurusanCardProps) {
  const IconComponent = (LucideIcons as any)[jurusan.icon] || LucideIcons.GraduationCap;
  const gradientClass = getJurusanGradient(jurusan.nama_jurusan);

  return (
    <button
      onClick={onClick}
      className="group relative card-glass rounded-xl-2 hover-lift p-4 sm:p-6 text-left border border-white/6 hover:border-blue-500/30 w-full shadow-lg hover:shadow-blue-500/20"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 ${gradientClass} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-inner`}>
          <IconComponent className="w-9 h-9 text-white opacity-95 group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-white mb-2 truncate">
            {formatJurusanName(jurusan.nama_jurusan)}
          </h3>
          <p className="text-sm text-white/80 line-clamp-2">{jurusan.deskripsi}</p>

          {/* Top student badge (optional) */}
          <div className="mt-4 w-full">
            {topStudents && topStudents.length > 0 ? (
              <div className="mt-3 w-full">
                <div className="text-xs text-white/70 mb-1">Top 3</div>
                <div className="flex flex-col space-y-2">
                  {topStudents.slice(0, 3).map((s, idx) => (
                    <div key={s.id} className="flex items-center justify-between text-sm text-white/90 bg-gradient-to-r from-white/10 to-transparent theme-clear:from-slate-500/10 rounded-lg p-2 border border-white/6 theme-clear:border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full text-black font-semibold text-xs ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : 'bg-orange-300'}`}>
                          {idx + 1}
                        </div>
                        <div className="leading-none">
                          <div className="font-semibold text-sm truncate sm:w-36">{s.nama}</div>
                          <div className="text-xs text-white/60">Skor {s.skor} — {s.kelas ?? ''}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-white/60 mt-3">Belum ada nilai</div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <LucideIcons.ChevronRight className="w-5 h-5 text-blue-500" />
      </div>
    </button>
  );
}

