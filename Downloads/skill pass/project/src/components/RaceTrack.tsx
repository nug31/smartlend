import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Flag, Gauge, Trophy } from 'lucide-react';
import type { RaceParticipant } from '../types';

interface RaceTrackProps {
    participants: RaceParticipant[];
    title?: string;
    subtitle?: string;
    autoStart?: boolean;
    trigger?: boolean;
}

export function RaceTrack({
    participants,
    title = "LIVE RACE LEADERBOARD",
    subtitle = "Speed Competition",
    autoStart = true,
    trigger = false
}: RaceTrackProps) {
    const [startRace, setStartRace] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
    const winner = sortedParticipants[0];

    useEffect(() => {
        if (autoStart) {
            setCountdown(3);
        }
    }, [autoStart]);

    useEffect(() => {
        if (!autoStart && trigger && countdown === null && !startRace) {
            setCountdown(3);
        }
    }, [trigger, autoStart, countdown, startRace]);

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (countdown !== null && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            const timer = setTimeout(() => {
                setCountdown(null);
                setStartRace(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    useEffect(() => {
        if (startRace && winner) {
            const timer = setTimeout(() => setShowConfetti(true), 2500);
            return () => clearTimeout(timer);
        }
    }, [startRace, winner]);

    return (
        <div className="relative min-h-[600px] card-glass backdrop-blur-xl rounded-2xl border border-slate-300 dark:border-white/10 p-6 sm:p-8 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} />}

            {/* Header */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
                        <Flag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight uppercase">{title}</h2>
                        <div className="text-sm text-indigo-600 dark:text-indigo-300 font-medium flex items-center gap-2 mt-1">
                            <Gauge className="w-4 h-4" />
                            <span>{subtitle}</span>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700 dark:text-white/50 bg-white dark:bg-[#0f172a] px-4 py-2 rounded-full border border-slate-300 dark:border-white/10 shadow-inner [.theme-clear_&]:bg-white [.theme-clear_&]:text-slate-900 [.theme-clear_&]:border-slate-300">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                        <span>Leader</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
                        <span>Moving Fast</span>
                    </div>
                </div>
            </div>

            {/* Countdown Overlay */}
            <AnimatePresence>
                {countdown !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="text-9xl font-black italic text-transparent bg-clip-text bg-gradient-to-tr from-yellow-400 via-orange-500 to-red-600 drop-shadow-[0_0_50px_rgba(234,179,8,0.5)]"
                        >
                            {countdown === 0 ? "GO!" : countdown}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tracks */}
            <div className="space-y-6 relative z-10 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar pb-4">
                {sortedParticipants.map((p, index) => {
                    const isLeader = index === 0;
                    return (
                        <div key={p.id} className="relative group">
                            <div className="flex items-center gap-4 sm:gap-6">
                                {/* Rank */}
                                <div className={`w-8 text-center font-black text-xl italic ${isLeader ? 'text-yellow-500 dark:text-yellow-400' : 'text-slate-500 dark:text-white/60'
                                    }`}>
                                    {index + 1}
                                </div>

                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-lg ${isLeader ? 'bg-slate-800 dark:bg-[#1e293b] text-yellow-500 border border-yellow-500/50 shadow-yellow-500/20' : 'bg-white dark:bg-[#1e293b] text-slate-900 dark:text-white border border-slate-300 dark:border-white/10 [.theme-clear_&]:bg-white [.theme-clear_&]:text-slate-900 [.theme-clear_&]:border-slate-300'
                                    }`}>
                                    {/* In generic mode, prioritize icon/alias or fallback to initials */}
                                    {p.alias || p.name.substring(0, 2).toUpperCase()}
                                </div>

                                {/* Main Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-base font-bold truncate ${isLeader ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-900 dark:text-white'}`}>
                                                {p.name}
                                            </span>
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-white/50 uppercase tracking-wider border border-slate-300 dark:border-white/5">
                                                {p.label}
                                            </span>
                                            {isLeader && <Trophy className="w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400" />}
                                        </div>
                                        <div className="text-xs font-bold text-slate-600 dark:text-white/60 font-mono">
                                            {typeof p.score === 'number' && !Number.isInteger(p.score) ? p.score.toFixed(1) : p.score} XP
                                        </div>
                                    </div>

                                    <div className="h-3 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden relative border border-slate-300 dark:border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={startRace ? { width: `${Math.min(p.score, 100)}%` } : { width: 0 }} // Cap at 100% logic or relative? Assuming score 0-100
                                            transition={{ duration: 2, ease: "easeOut", delay: index * 0.1 }}
                                            className={`h-full relative ${p.color ? p.color : // Allow passing gradient class
                                                isLeader
                                                    ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-200'
                                                    : 'bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500'
                                                }`}
                                            // Allow passing custom style for width if score > 100? No, width is percentage
                                            style={p.score > 100 ? { width: '100%' } : {}}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-[30%] -skew-x-12 animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Right Badge */}
                                <div className="hidden sm:block w-24 text-right">
                                    {p.badge_name && (
                                        <div className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border shadow-lg ${(p.badge_name === 'Master' || p.badge_name === 'Champion') ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20 shadow-yellow-500/10' :
                                            (p.badge_name === 'Advance' || p.badge_name === 'Top Tier') ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20' :
                                                p.badge_name === 'Applied' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20' :
                                                    'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border-slate-300 dark:border-white/10'
                                            }`}>
                                            {p.badge_name}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-[-12px] left-12 right-0 h-px bg-slate-300 dark:bg-white/5" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
