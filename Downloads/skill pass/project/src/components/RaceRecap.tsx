import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import type { Jurusan } from '../types';

interface RaceRecapProps {
    jurusanData: Array<{
        jurusan: Jurusan;
        averageSkor: number;
        studentCount: number;
    }>;
}

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

export function RaceRecap({ jurusanData }: RaceRecapProps) {
    const [startAnimation, setStartAnimation] = useState(false);

    // Sort by average score (highest first)
    const sortedData = [...jurusanData].sort((a, b) => b.averageSkor - a.averageSkor);

    useEffect(() => {
        const timer = setTimeout(() => setStartAnimation(true), 500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="mb-12">
            <div className="card-glass rounded-xl p-6 shadow-2xl border border-white/10 bg-[#0f172a]/80 backdrop-blur-xl">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Icons.Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Jurusan Race Recap</h2>
                            <p className="text-sm text-white/60 font-medium">Live progress semua jurusan - skor rata-rata siswa</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {sortedData.map((item, index) => {
                        const IconComponent = (Icons as any)[item.jurusan.icon] || Icons.GraduationCap;
                        const colorClass = colorPalette[index % colorPalette.length];
                        const percentage = (item.averageSkor / 100) * 100;

                        return (
                            <motion.div
                                key={item.jurusan.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="flex items-center gap-4 md:gap-6 p-2 rounded-xl hover:bg-white/5 transition-colors">
                                    {/* Rank Badge */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${index === 0 ? 'bg-yellow-400 text-black shadow-yellow-500/50' :
                                            index === 1 ? 'bg-gray-300 text-black' :
                                                index === 2 ? 'bg-orange-400 text-black' :
                                                    'bg-[#1e293b] text-white/70 border border-white/10'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    {/* Icon and Name */}
                                    <div className="flex-shrink-0 w-56 flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-md`}>
                                            <IconComponent className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{item.jurusan.nama_jurusan}</div>
                                            <div className="text-xs text-white/50">{item.studentCount} siswa</div>
                                        </div>
                                    </div>

                                    {/* Animated Progress Bar */}
                                    <div className="flex-1 relative h-12 bg-[#0f172a] rounded-lg overflow-hidden border border-white/5 shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: startAnimation ? `${percentage}%` : 0 }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.1 }}
                                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClass} flex items-center justify-end px-4`}
                                        >
                                            {/* Shine Effect */}
                                            <motion.div
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: Math.random() }}
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full skew-x-12"
                                            />

                                            {/* Score inside bar */}
                                            <span className="text-sm font-bold text-white drop-shadow-md z-10">
                                                {item.averageSkor.toFixed(1)}
                                            </span>
                                        </motion.div>
                                    </div>

                                    {/* Score Display Right */}
                                    <div className="flex-shrink-0 w-16 text-right">
                                        <div className="text-lg font-bold text-white">{item.averageSkor.toFixed(0)}</div>
                                        <div className="text-[10px] text-white/40 font-mono">/ 100</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {sortedData.length === 0 && (
                    <div className="text-center py-12 text-white/40 italic">
                        Belum ada data skor untuk ditampilkan
                    </div>
                )}
            </div>
        </div>
    );
}
