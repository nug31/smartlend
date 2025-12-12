import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import type { RaceParticipant } from '../types';

interface PodiumProps {
    participants: RaceParticipant[]; // Expects top 3 ordered or raw list? Let's assume passed sorted or we pick top 3
    title?: string;
    subtitle?: string;
}

export function Podium({ participants, title = "Champions Podium", subtitle }: PodiumProps) {
    // Sorting just in case
    const sorted = [...participants].sort((a, b) => b.score - a.score).slice(0, 3);

    // Layout: 2nd (Left), 1st (Center), 3rd (Right)
    const podiumData = [
        sorted[1] || null, // 2nd
        sorted[0] || null, // 1st
        sorted[2] || null, // 3rd
    ];

    return (
        <div className="relative min-h-[600px] w-full flex items-end justify-center gap-4 sm:gap-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0f172a] to-[#0f172a] dark:from-indigo-900/40 dark:via-[#0f172a] dark:to-[#0f172a] theme-clear:bg-gradient-to-b theme-clear:from-white theme-clear:to-slate-100 rounded-2xl border border-white/10 theme-clear:border-slate-200 p-8 overflow-hidden shadow-2xl">
            {/* Background Spotlights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[2px] h-[400px] bg-yellow-400/20 rotate-[25deg] blur-md origin-top animate-pulse" />
                <div className="absolute top-0 right-1/4 w-[2px] h-[400px] bg-yellow-400/20 rotate-[-25deg] blur-md origin-top animate-pulse delay-75" />
                <div className="absolute top-0 left-1/2 w-[100px] h-[400px] bg-gradient-to-b from-white/10 to-transparent -translate-x-1/2 blur-2xl theme-clear:from-indigo-500/10" />
            </div>

            <div className="absolute top-6 left-0 right-0 text-center z-10">
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 theme-clear:bg-white/40 theme-clear:border-slate-200"
                >
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-white theme-clear:text-slate-800 tracking-widest uppercase">{title}</span>
                </motion.div>
                {subtitle && <div className="text-white/40 theme-clear:text-slate-500 text-xs mt-2">{subtitle}</div>}
            </div>

            {podiumData.map((p, index) => {
                // Index 0 is 2nd place, Index 1 is 1st place, Index 2 is 3rd place in our visual array
                const place = index === 0 ? 2 : index === 1 ? 1 : 3;
                const height = place === 1 ? 'h-64 sm:h-80' : place === 2 ? 'h-48 sm:h-60' : 'h-32 sm:h-44';
                const color = place === 1 ? 'bg-gradient-to-b from-yellow-400 via-yellow-600 to-yellow-800' :
                    place === 2 ? 'bg-gradient-to-b from-gray-300 via-gray-400 to-gray-600' :
                        'bg-gradient-to-b from-orange-400 via-orange-600 to-orange-800';

                const delay = place === 1 ? 0.4 : place === 2 ? 0.2 : 0.6; // 2nd, then 1st, then 3rd

                if (!p) return <div key={index} className="w-1/3 max-w-[150px]" />;

                return (
                    <motion.div
                        key={p.id}
                        initial={{ y: 200, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 12, delay }}
                        className={`relative flex flex-col items-center justify-end w-1/3 max-w-[160px] ${index === 1 ? 'z-20 mb-4' : 'z-10'}`}
                    >
                        {/* Avatar / Character */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: delay + 0.3, type: "spring" }}
                            className="mb-4 relative"
                        >
                            {place === 1 && (
                                <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] animate-bounce" />
                            )}
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 shadow-xl flex items-center justify-center bg-[#1e293b] theme-clear:bg-white overflow-hidden ${place === 1 ? 'border-yellow-400 shadow-yellow-500/50' :
                                place === 2 ? 'border-gray-300 shadow-gray-400/50 theme-clear:border-slate-300' : 'border-orange-400 shadow-orange-500/50'
                                }`}>
                                {/* Prioritize icon/alias if available */}
                                <span className="text-xl sm:text-2xl font-bold text-white theme-clear:text-slate-800">
                                    {p.alias || p.name.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/80 theme-clear:bg-white theme-clear:text-slate-700 theme-clear:border-slate-200 rounded text-[10px] text-white whitespace-nowrap border border-white/20">
                                {place === 1 ? 'Champion' : place === 2 ? 'Runner Up' : 'Third'}
                            </div>
                        </motion.div>

                        {/* Pillar */}
                        <div className={`w-full ${height} ${color} rounded-t-lg relative shadow-2xl group cursor-pointer hover:brightness-110 transition-all`}>
                            {/* Shine */}
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none opacity-50" />

                            {/* Rank Number */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl sm:text-6xl font-black text-black/20 select-none">
                                {place}
                            </div>

                            {/* Info Card on Base */}
                            <div className="absolute bottom-4 left-0 right-0 px-2 text-center text-white theme-clear:text-white drop-shadow-md">
                                <div className="font-bold text-sm sm:text-base truncate">{p.name}</div>
                                <div className="text-xs opacity-90">{p.label}</div>
                                <div className="mt-2 inline-block px-2 py-0.5 bg-black/30 theme-clear:bg-white/20 rounded text-xs font-mono border border-white/10 theme-clear:border-white/30">
                                    {typeof p.score === 'number' && !Number.isInteger(p.score) ? p.score.toFixed(1) : p.score} XP
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
