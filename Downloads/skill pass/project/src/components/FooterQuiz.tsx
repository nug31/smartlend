import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, XCircle, Timer, Trophy, RotateCcw, Play } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctIndex: number;
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "Apa alat ukur untuk mengukur diameter dalam pipa?",
        options: ["Jangka Sorong", "Mikrometer Sekrup", "Mistarmeter"],
        correctIndex: 0
    },
    {
        id: 2,
        text: "Software yang biasa digunakan untuk desain 3D teknik?",
        options: ["Adobe Photoshop", "AutoCAD / SolidWorks", "Microsoft Excel"],
        correctIndex: 1
    },
    {
        id: 3,
        text: "Komponen elektronika penyearah arus adalah?",
        options: ["Resistor", "Kapasitor", "Dioda"],
        correctIndex: 2
    }
];

export function FooterQuiz() {
    // State
    const [gameState, setGameState] = useState<'start' | 'playing' | 'feedback' | 'finished'>('start');
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    // Timer Logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (gameState === 'playing' && timeLeft === 0) {
            handleTimeout();
        }
        return () => clearTimeout(timer);
    }, [gameState, timeLeft]);

    const handleTimeout = () => {
        setIsCorrect(false);
        setGameState('feedback');
        setTimeout(nextQuestion, 1500);
    };

    const startGame = () => {
        setScore(0);
        setCurrentQIndex(0);
        setGameState('playing');
        resetQuestion();
    };

    const resetQuestion = () => {
        setTimeLeft(10);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    const handleAnswer = (index: number) => {
        if (gameState !== 'playing') return;

        setSelectedOption(index);
        const correct = index === QUESTIONS[currentQIndex].correctIndex;
        setIsCorrect(correct);
        if (correct) setScore(s => s + 1);

        setGameState('feedback');
        setTimeout(nextQuestion, 1500);
    };

    const nextQuestion = () => {
        if (currentQIndex < QUESTIONS.length - 1) {
            setCurrentQIndex(prev => prev + 1);
            setGameState('playing');
            resetQuestion();
        } else {
            setGameState('finished');
        }
    };

    // Variabel Colors
    const bgColor = gameState === 'feedback'
        ? (isCorrect ? 'bg-emerald-900/95' : 'bg-red-900/95')
        : 'bg-[#0f172a]/95';

    const borderColor = gameState === 'feedback'
        ? (isCorrect ? 'border-emerald-500/50' : 'border-red-500/50')
        : 'border-white/10';

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-50 transition-colors duration-500 ${bgColor} backdrop-blur-md border-t-2 ${borderColor} rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]`}>
            <div className="max-w-4xl mx-auto px-4 py-3 min-h-[140px] flex items-center justify-center">
                <AnimatePresence mode="wait">

                    {/* START SCREEN */}
                    {gameState === 'start' && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex items-center gap-6 w-full justify-between sm:justify-center"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                                    <HelpCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#ffffff]">Mini Kompetensi Quiz</h3>
                                    <p className="text-sm text-[#ffffff]/50">Uji pengetahuan teknikmu dalam 30 detik!</p>
                                </div>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-[#ffffff] font-bold rounded-full shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2 group"
                            >
                                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                                Mulai Quiz
                            </button>
                        </motion.div>
                    )}

                    {/* QUESTION SCREEN */}
                    {(gameState === 'playing' || gameState === 'feedback') && (
                        <motion.div
                            key="question"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col sm:flex-row items-center gap-6 py-2"
                        >
                            {/* Left: Timer & Progress */}
                            <div className="flex sm:flex-col items-center gap-3 sm:gap-2 mr-4 border-r border-white/10 pr-6 w-full sm:w-auto justify-between sm:justify-center">
                                <div className="flex items-center gap-2 text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1 rounded-full">
                                    <Timer className="w-4 h-4" />
                                    <span>{timeLeft}s</span>
                                </div>
                                <div className="text-xs text-[#ffffff]/40 font-mono">
                                    Q{currentQIndex + 1}/{QUESTIONS.length}
                                </div>
                            </div>

                            {/* Center: Question & Options */}
                            <div className="flex-1 w-full relative">
                                <AnimatePresence mode="wait">
                                    <motion.h4
                                        key={QUESTIONS[currentQIndex].id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-lg font-bold text-[#ffffff] mb-3 text-center sm:text-left"
                                    >
                                        {QUESTIONS[currentQIndex].text}
                                    </motion.h4>
                                </AnimatePresence>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {QUESTIONS[currentQIndex].options.map((opt, idx) => {
                                        let btnClass = "bg-white/5 text-[#ffffff]/70 hover:bg-white/10 hover:text-[#ffffff] border-white/5";

                                        // Feedback Logic
                                        if (gameState === 'feedback') {
                                            if (idx === QUESTIONS[currentQIndex].correctIndex) {
                                                btnClass = "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
                                            } else if (idx === selectedOption) {
                                                btnClass = "bg-red-500/20 text-red-400 border-red-500/50";
                                            } else {
                                                btnClass = "opacity-30 bg-black/10 text-[#ffffff]/30 border-transparent";
                                            }
                                        }

                                        return (
                                            <motion.button
                                                key={idx}
                                                whileHover={gameState === 'playing' ? { scale: 1.02 } : {}}
                                                whileTap={gameState === 'playing' ? { scale: 0.98 } : {}}
                                                className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors text-left relative overflow-hidden ${btnClass}`}
                                                onClick={() => handleAnswer(idx)}
                                                disabled={gameState !== 'playing'}
                                                animate={gameState === 'feedback' && idx === selectedOption ? {
                                                    x: isCorrect ? [0, -5, 5, 0] : [0, -10, 10, -10, 10, 0], // Shake
                                                    borderColor: isCorrect ? '#10b981' : '#ef4444'
                                                } : {}}
                                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                            >
                                                {opt}
                                                {gameState === 'feedback' && idx === QUESTIONS[currentQIndex].correctIndex && (
                                                    <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                                                )}
                                                {gameState === 'feedback' && idx === selectedOption && !isCorrect && (
                                                    <XCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* FINISHED SCREEN */}
                    {gameState === 'finished' && (
                        <motion.div
                            key="finished"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col sm:flex-row items-center gap-8 justify-center w-full"
                        >
                            <motion.div
                                className="relative"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-20 rounded-full animate-pulse" />
                                <Trophy className="w-16 h-16 text-yellow-400 relative z-10" />
                            </motion.div>

                            <div className="text-center sm:text-left">
                                <h3 className="text-2xl font-black text-[#ffffff] mb-1">
                                    {score === QUESTIONS.length ? 'PERFECT SCORE!' : score > 0 ? 'WELL DONE!' : 'NICE TRY!'}
                                </h3>
                                <div className="text-[#ffffff]/60 mb-4">
                                    Kamu menjawab <span className="text-[#ffffff] font-bold">{score}</span> dari {QUESTIONS.length} pertanyaan dengan benar.
                                </div>
                                <button
                                    onClick={startGame}
                                    className="px-6 py-2 bg-white text-indigo-900 font-bold rounded-lg shadow-lg hover:scale-105 transition-transform flex items-center gap-2 mx-auto sm:mx-0"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Main Lagi
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Background Timer Line */}
            {gameState === 'playing' && (
                <motion.div
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: 10, ease: 'linear' }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                />
            )}
        </div>
    );
}
