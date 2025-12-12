import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate, useTransform, AnimatePresence } from 'framer-motion';
import { Target, Trophy, Play, Instagram, Phone } from 'lucide-react';

export function FooterReflexGame() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [result, setResult] = useState<'perfect' | 'miss' | null>(null);
    const [score, setScore] = useState(0);
    const [speed, setSpeed] = useState(1.5); // Seconds per one way trip

    // Motion Value for Pointer Position (0 to 100)
    const x = useMotionValue(0);
    const xPercent = useTransform(x, value => `${value}%`);

    // Animation Controls Ref
    const controlsRef = useRef<any>(null);

    const startGame = () => {
        setIsPlaying(true);
        setResult(null);

        // Random start direction or position? No, simplify: start from 0 every time or just unpause?
        // Let's reset to 0 for consistency or random?
        // Requirement: "Looping animation".

        // Start Animation
        // We use pure framer motion animate function for the motionValue
        if (controlsRef.current) controlsRef.current.stop();

        x.set(0);
        controlsRef.current = animate(x, 100, {
            duration: speed,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
            onUpdate: () => {
                // Ensure UI updates if needed, but useTransform handles ref updates
            }
        });
    };

    const stopGame = () => {
        if (!isPlaying) return;

        if (controlsRef.current) controlsRef.current.stop();
        setIsPlaying(false);

        const finalPosition = x.get();
        // Target is center: 50. Zone: 45 to 55 (10% width)
        const isPerfect = finalPosition >= 42 && finalPosition <= 58; // Slightly generous 16%

        if (isPerfect) {
            setResult('perfect');
            setScore(s => s + 1);
            setSpeed(s => Math.max(0.5, s * 0.9)); // Get faster
        } else {
            setResult('miss');
            setScore(0); // Reset score on miss? Or just don't add? "game over" on miss usually resets combo.
            setSpeed(1.5); // Reset speed
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (controlsRef.current) controlsRef.current.stop();
        };
    }, []);

    // Initial Start? No, wait for user.

    return (
        <div className="w-full relative z-40">
            {/* Decorative Top Shape */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[1px] w-32 h-4 bg-[#0f172a] rounded-t-xl z-20 [.theme-clear_&]:bg-white [.theme-clear_&]:border-t [.theme-clear_&]:border-x [.theme-clear_&]:border-slate-200" />

            {/* Main Container */}
            <div className="bg-[#0f172a]/95 backdrop-blur-md border-t-2 border-indigo-500/20 rounded-t-2xl shadow-[0_-5px_30px_rgba(0,0,0,0.6)] flex flex-col items-center py-6 relative overflow-hidden [.theme-clear_&]:bg-white/95 [.theme-clear_&]:border-slate-200 [.theme-clear_&]:shadow-slate-200/50">

                {/* Background Grid FX */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                {/* Score & Title */}
                <div className="w-full max-w-lg flex justify-between px-8 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-lg">
                            <Target className="w-5 h-5 text-indigo-400 [.theme-clear_&]:text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white tracking-wider [.theme-clear_&]:text-slate-900">REFLEX TEST</h3>
                            <p className="text-[10px] text-indigo-300/60 uppercase [.theme-clear_&]:text-slate-500">Stop at center</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Trophy className={`w-4 h-4 ${score > 0 ? 'text-yellow-400' : 'text-slate-600 [.theme-clear_&]:text-slate-400'}`} />
                        <span className="font-mono text-xl font-bold text-white [.theme-clear_&]:text-slate-900">{score}</span>
                    </div>
                </div>

                {/* Game Track */}
                <div className="w-full max-w-lg px-8 relative mb-8">
                    {/* Track Line */}
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative [.theme-clear_&]:bg-slate-200">
                        {/* Center Zone Details */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[16%] bg-gradient-to-r from-emerald-500/20 via-emerald-500/50 to-emerald-500/20 border-x border-emerald-500/50" />
                    </div>

                    {/* Tick Marks */}
                    <div className="absolute top-3 left-0 right-0 flex justify-between px-8 text-[10px] font-mono text-slate-600 select-none [.theme-clear_&]:text-slate-400">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                    </div>

                    {/* Moving Pointer */}
                    <div className="absolute top-[-10px] left-8 right-8 h-8 pointer-events-none">
                        <motion.div
                            className="absolute -ml-[2px] w-[4px] h-7 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8] z-10"
                            style={{ left: xPercent }}
                        >
                            <div className="absolute -top-1 -left-[3px] w-3 h-3 bg-white rounded-full" />
                        </motion.div>
                    </div>
                </div>

                {/* Controls & Result */}
                <div className="h-12 mb-4 flex items-center justify-center w-full z-50">
                    <AnimatePresence mode="wait">
                        {!isPlaying && !result && (
                            <motion.button
                                key="start"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={startGame}
                                className="px-8 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                START
                            </motion.button>
                        )}

                        {isPlaying && (
                            <motion.button
                                key="stop"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={stopGame}
                                className="px-10 py-3 bg-white text-indigo-900 font-black text-lg tracking-widest rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-gray-100 [.theme-clear_&]:bg-indigo-600 [.theme-clear_&]:text-white [.theme-clear_&]:shadow-indigo-500/20"
                            >
                                STOP
                            </motion.button>
                        )}

                        {result && (
                            <motion.div
                                key="result"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="flex flex-col items-center"
                            >
                                <div className={`text-2xl font-black italic tracking-tighter mb-1 ${result === 'perfect' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'text-red-400'}`}>
                                    {result === 'perfect' ? 'PERFECT!' : 'MISS!'}
                                </div>
                                <button
                                    onClick={startGame}
                                    className="text-white/50 hover:text-white text-xs underline decoration-dotted transition-colors [.theme-clear_&]:text-slate-500 [.theme-clear_&]:hover:text-slate-800"
                                >
                                    Try Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Developer Credits - Always visible below controls */}
                <div className="flex flex-col items-center gap-1 mt-auto pt-2 border-t border-white/5 [.theme-clear_&]:border-slate-200 w-full max-w-xs">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest [.theme-clear_&]:text-slate-400">Developed by jsnugroho</span>
                    <div className="flex items-center gap-4 text-[10px] text-white/50 [.theme-clear_&]:text-slate-500 relative z-50">
                        <a
                            href="https://www.instagram.com/j.s_nugroho/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-indigo-400 transition-colors cursor-pointer pointer-events-auto"
                        >
                            <Instagram className="w-3 h-3" /> j.s_nugroho
                        </a>
                        <a
                            href="https://wa.me/6281316052316"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 hover:text-green-400 transition-colors cursor-pointer pointer-events-auto"
                        >
                            <Phone className="w-3 h-3" /> 081316052316
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}
