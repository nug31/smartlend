import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flag, Trophy, BarChart3, Medal } from 'lucide-react';
import type { StudentListItem, RaceParticipant } from '../types';
import { RaceTrack } from './RaceTrack';
import { Podium } from './Podium';

interface StudentRaceProps {
    students: StudentListItem[];
    jurusanName?: string;
}

type ViewMode = 'list' | 'race' | 'podium';

export function StudentRace({ students, jurusanName }: StudentRaceProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('race');

    // Sort students for podium/rankings
    const sortedStudents = [...students].sort((a, b) => b.skor - a.skor);

    // Map to RaceParticipant
    const participants: RaceParticipant[] = sortedStudents.map((s) => ({
        id: s.id,
        name: s.nama,
        score: s.skor,
        label: s.kelas, // or formatClassLabel logic if accessed here, but it's passed formatted or raw. `s.kelas` is usually raw.
        // We pass raw kelas, RaceTrack handles display. Wait, RaceTrack displays `label`.
        // The previous RaceTrack used `formatClassLabel(jurusanName, student.kelas)`.
        // We should format it here if we want it formatted in the RaceTrack.
        // But `formatClassLabel` checks if jurusanName matches.
        badge_name: s.badge_name,
        alias: s.nama.substring(0, 2).toUpperCase()
    }));

    const topParticipants = participants.slice(0, 3);

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* View Toggles */}
            <div className="flex justify-center mb-8">
                <div className="card-glass p-1.5 rounded-2xl flex gap-1 shadow-2xl">
                    <button
                        onClick={() => setViewMode('race')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'race'
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                            }`}
                    >
                        <Flag className="w-4 h-4" />
                        <span>Race Track</span>
                    </button>
                    <button
                        onClick={() => setViewMode('podium')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'podium'
                            ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/25 ring-1 ring-white/20'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-black/5 dark:text-white/40 dark:hover:text-white dark:hover:bg-white/5'
                            }`}
                    >
                        <Trophy className="w-4 h-4" />
                        <span>Podium 3D</span>
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${viewMode === 'list'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-white/20'
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
                        <RaceTrack participants={participants} title={`Race Siswa: ${jurusanName}`} subtitle="Speed Competition" />
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
                        <Podium participants={topParticipants} title="Champions Podium" subtitle={jurusanName} />
                    </motion.div>
                )}

                {viewMode === 'list' && (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="card-glass rounded-2xl p-6 shadow-xl"
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Medal className="w-5 h-5 text-yellow-500" />
                            <span className="text-slate-800 dark:text-white">Top Performers</span>
                        </h3>
                        <div className="space-y-3">
                            {participants.slice(0, 10).map((p, idx) => (
                                <div key={p.id} className="flex items-center justify-between p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20 transition-all shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${idx === 0 ? 'bg-yellow-400 text-black' :
                                            idx === 1 ? 'bg-gray-300 text-black' :
                                                idx === 2 ? 'bg-orange-400 text-black' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white'
                                            }`}>
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 dark:text-white">{p.name}</div>
                                            <div className="text-xs text-slate-500 dark:text-white/50">{p.label}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{p.score} XP</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
