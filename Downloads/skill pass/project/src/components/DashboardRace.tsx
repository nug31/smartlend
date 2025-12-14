import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Trophy, BarChart3, Medal, Users, LayoutDashboard, Target } from 'lucide-react';
import type { Jurusan, RaceParticipant } from '../types';
import { RaceTrack } from './RaceTrack';
import { Podium } from './Podium';
import * as Icons from 'lucide-react';

interface DashboardRaceProps {
    jurusanData: Array<{
        jurusan: Jurusan;
        averageSkor: number;
        studentCount: number;
    }>;
    trigger?: number; // now a timestamp or signal
}

type ViewMode = 'list' | 'race' | 'podium';

// Color palette matching the uploaded image design
const colorPalette = [
    'from-blue-500 to-blue-600',     // 1. Teknik Mesin (Blue)
    'from-purple-500 to-purple-600', // 2. Teknik Instalasi (Purple)
    'from-green-500 to-emerald-500', // 3. Teknik Kendaraan (Green)
    'from-yellow-400 to-amber-500',  // 4. Akuntansi (Yellow)
    'from-red-500 to-rose-600',      // 5. Teknik Kimia (Red)
    'from-pink-500 to-fuchsia-600',  // 6. Perhotelan (Pink)
    'from-indigo-500 to-blue-600',   // 7. Teknik Sepeda Motor (Indigo/Blue)
    'from-teal-400 to-teal-600',     // 8. TEI (Teal)
];

export function DashboardRace({ jurusanData, trigger = 0 }: DashboardRaceProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('race');

    // Stats Calculation
    const totalJurusan = jurusanData.length;
    const totalSiswa = jurusanData.reduce((acc, curr) => acc + curr.studentCount, 0);
    const avgSchoolScore = totalJurusan > 0
        ? jurusanData.reduce((acc, curr) => acc + curr.averageSkor, 0) / totalJurusan
        : 0;

    // Watch for external trigger to force race view
    const [lastTrigger, setLastTrigger] = useState(trigger);
    if (trigger !== lastTrigger) {
        setLastTrigger(trigger);
        setViewMode('race');
    }

    const sortedData = [...jurusanData].sort((a, b) => b.averageSkor - a.averageSkor);
    const topJurusan = sortedData[0];

    // Map to RaceParticipant
    const participants: RaceParticipant[] = sortedData.map((item, index) => {
        const colorClass = colorPalette[index % colorPalette.length];
        return {
            id: item.jurusan.id,
            name: item.jurusan.nama_jurusan,
            score: item.averageSkor,
            label: `${item.studentCount} Siswa`,
            // We can pass color class to RaceTrack if it supports it
            color: `bg-gradient-to-r ${colorClass}`,
            alias: item.jurusan.nama_jurusan.substring(0, 2).toUpperCase(),
            badge_name: index < 3 ? (index === 0 ? 'Champion' : 'Top Tier') : 'Contender'
        };
    });

    const topParticipants = participants.slice(0, 3);

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Card 1: Total Jurusan */}
                <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LayoutDashboard className="w-16 h-16 text-blue-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <LayoutDashboard className="w-5 h-5" />
                        </div>
                        <span className="text-sm subtle font-medium">Total Jurusan</span>
                    </div>
                    <div className="text-2xl font-bold">{totalJurusan}</div>
                    <div className="text-xs text-blue-500 mt-1">Active Classes</div>
                </div>

                {/* Card 2: Total Siswa */}
                <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users className="w-16 h-16 text-purple-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                            <Users className="w-5 h-5" />
                        </div>
                        <span className="text-sm subtle font-medium">Total Siswa</span>
                    </div>
                    <div className="text-2xl font-bold">{totalSiswa}</div>
                    <div className="text-xs text-purple-500 mt-1">Enrolled Students</div>
                </div>

                {/* Card 3: Avg Score */}
                <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Target className="w-16 h-16 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <Target className="w-5 h-5" />
                        </div>
                        <span className="text-sm subtle font-medium">Avg Score</span>
                    </div>
                    <div className="text-2xl font-bold">{avgSchoolScore.toFixed(1)}</div>
                    <div className="text-xs text-emerald-500 mt-1">School Average</div>
                </div>

                {/* Card 4: Top Jurusan */}
                <div className="card-glass p-4 rounded-xl relative overflow-hidden group hover:-translate-y-1 transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Trophy className="w-16 h-16 text-yellow-500" />
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-600">
                            <Trophy className="w-5 h-5" />
                        </div>
                        <span className="text-sm subtle font-medium">Top Jurusan</span>
                    </div>
                    <div className="text-xl font-bold truncate">{topJurusan?.jurusan.nama_jurusan || '-'}</div>
                    <div className="text-xs text-yellow-600 mt-1">Leader</div>
                </div>
            </div>

            {/* View Toggles */}
            <div className="flex justify-center mb-8">
                <div className="card-glass p-1.5 rounded-2xl flex gap-1 shadow-2xl">
                    <button
                        onClick={() => setViewMode('race')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'race'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                            }`}
                    >
                        <Flag className="w-4 h-4" />
                        <span>Race Track</span>
                    </button>
                    <button
                        onClick={() => setViewMode('podium')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'podium'
                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                            }`}
                    >
                        <Trophy className="w-4 h-4" />
                        <span>Podium 3D</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'list'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                            }`}
                    >
                        <BarChart3 className="w-4 h-4" />
                        <span>Leaderboard</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {viewMode === 'race' && (
                    <motion.div
                        key="race"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <RaceTrack
                            participants={participants}
                            title="Jurusan Race Series"
                            subtitle="Live Average Score Competition"
                            autoStart={false}
                            trigger={trigger > 0}
                        />
                    </motion.div>
                )}

                {viewMode === 'podium' && (
                    <motion.div
                        key="podium"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Podium participants={topParticipants} title="Top Majors Podium" subtitle="Best Average Scores" />
                    </motion.div>
                )}

                {viewMode === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="card-glass rounded-2xl p-6 shadow-2xl"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg shadow-lg">
                                <Medal className="w-5 h-5 text-white" />
                            </div>
                            Jurusan Leaderboard
                        </h3>
                        <div className="space-y-4">
                            {participants.map((p, idx) => {
                                const originalIndex = idx; // Since sorted
                                const IconComponent = (Icons as any)[sortedData[originalIndex].jurusan.icon] || Icons.GraduationCap;
                                const colorClass = colorPalette[originalIndex % colorPalette.length];

                                return (
                                    <div key={p.id} className="flex items-center justify-between p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-300 dark:border-white/5 shadow-sm hover:shadow-md hover:border-blue-500/30 dark:hover:bg-white/10 transition-all group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-black text-lg ${idx === 0 ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]' :
                                                idx === 1 ? 'bg-gray-300 text-black' :
                                                    idx === 2 ? 'bg-orange-400 text-black' : 'bg-black/10 dark:bg-white/10 text-gray-500 dark:text-white/50'
                                                }`}>
                                                {idx + 1}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                                    <IconComponent className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-lg">{p.name}</div>
                                                    <div className="text-sm subtle">{p.label}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black">{p.score.toFixed(1)}</div>
                                            <div className="text-xs subtle font-mono">AVG SKOR</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
