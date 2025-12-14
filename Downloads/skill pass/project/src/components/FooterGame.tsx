import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, AlertTriangle, Trophy, Zap, Play } from 'lucide-react';

export function FooterGame() {
    // Game State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [lane, setLane] = useState(1); // 0: Left, 1: Center, 2: Right
    const [obstacles, setObstacles] = useState<Array<{ id: number; lane: number; y: number; type: 'cone' | 'barrier' }>>([]);
    const [speed, setSpeed] = useState(5);

    // Refs for Loop
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>();
    const scoreIntervalRef = useRef<number>();

    // Constants
    const PLAYER_Y = 80; // Player position from bottom (%)
    const LANE_WIDTH_PERCENT = 33.33;

    // Controls
    const moveLeft = useCallback(() => {
        if (!isPlaying || isGameOver) return;
        setLane(curr => Math.max(0, curr - 1));
    }, [isPlaying, isGameOver]);

    const moveRight = useCallback(() => {
        if (!isPlaying || isGameOver) return;
        setLane(curr => Math.min(2, curr + 1));
    }, [isPlaying, isGameOver]);

    // Keyboard Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') moveLeft();
            if (e.key === 'ArrowRight') moveRight();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [moveLeft, moveRight]);

    // Swipe Handling
    const touchStartX = useRef<number>(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        if (Math.abs(diff) > 30) { // Threshold
            if (diff > 0) moveLeft(); // Swipe Left (dragged finger left) -> wait, drag left usually means looking right? No, swipe left moves content left? 
            // Swipe Left (finger moves right to left) -> Intent: Move Left? Usually.
            else moveRight();
        }
    };

    // Game Loop
    const startGame = () => {
        setIsPlaying(true);
        setIsGameOver(false);
        setScore(0);
        setLane(1);
        setObstacles([]);
        setSpeed(0.8); // Initial speed (percentage per frame?)
        lastTimeRef.current = performance.now();
        requestRef.current = requestAnimationFrame(gameLoop); // fixed this

        // Score Counter
        if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
        scoreIntervalRef.current = window.setInterval(() => {
            setScore(s => s + 10);
            setSpeed(s => Math.min(s + 0.05, 2.5)); // Increase speed slowly
        }, 1000);
    };

    const stopGame = () => {
        setIsPlaying(false);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    };

    const gameOver = () => {
        setIsGameOver(true);
        stopGame();
    };

    const gameLoop = (time: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = time;
        // Delta time logic could be better but simplified for now

        setObstacles(prev => {
            // Move obstacles
            const moved = prev.map(obs => ({ ...obs, y: obs.y + speed }));

            // Remove off-screen
            const active = moved.filter(obs => obs.y < 120); // allow falling off a bit

            // Collision Detection
            // Player is at lane 'lane', Y approx 80-90% (from top).
            // Let's say track is 100% height.
            // Player Y is fixed visually at bottom.
            // Let's define Y=0 at top, Y=100 at bottom.
            // Obstacles grow Y.
            // Player is at Y=80 (from top). height ~10.
            const playerHitBox = { y: PLAYER_Y, height: 10, lane: lane };

            for (const obs of active) {
                // Obstacle hitbox: y to y+10
                if (obs.lane === playerHitBox.lane &&
                    obs.y > playerHitBox.y - 5 &&
                    obs.y < playerHitBox.y + playerHitBox.height - 2) {
                    gameOver();
                    return prev; // Stop updates
                }
            }

            // Spawn new
            // Probability check based on speed?
            if (Math.random() < 0.02 + (speed * 0.01) && active.length < 5) {
                // Ensure reasonable spacing?
                const lastObs = active[active.length - 1];
                if (!lastObs || lastObs.y > 15) { // Space out
                    active.push({
                        id: Date.now() + Math.random(),
                        lane: Math.floor(Math.random() * 3),
                        y: -10,
                        type: Math.random() > 0.5 ? 'cone' : 'barrier'
                    });
                }
            }

            return active;
        });

        if (!isGameOver) {
            requestRef.current = requestAnimationFrame(gameLoop);
        }
    };

    // Cleanup
    useEffect(() => {
        return () => stopGame();
    }, []);

    // Re-trigger loop if state changes? No, refs handle it. 
    // Just need to ensure isGameOver breaks the loop. ref.current logic works.

    return (
        <div
            className="relative w-full h-[220px] bg-slate-900 border-t-4 border-yellow-400 overflow-hidden select-none outline-none"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => { if (!isPlaying && !isGameOver) startGame() }} // Click to start initially
        >
            {/* Road Markings */}
            <div className="absolute inset-0 flex">
                <div className="w-1/3 h-full border-r border-dashed border-white/20" />
                <div className="w-1/3 h-full border-r border-dashed border-white/20" />
                <div className="w-1/3 h-full" />
            </div>

            {/* Moving Speed Lines (Background FX) */}
            {isPlaying && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <motion.div
                        initial={{ y: 0 }}
                        animate={{ y: [0, 1000] }}
                        transition={{ repeat: Infinity, duration: 2 / speed, ease: "linear" }}
                        className="w-full h-[200%] bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] bg-[size:100%_100px]"
                    />
                </div>
            )}

            {/* Score */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="font-mono font-bold text-white text-lg">{score}</span>
            </div>

            {/* Speed Indicator */}
            {isPlaying && (
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1 text-white/50 text-xs font-mono">
                    <Zap className="w-3 h-3 text-cyan-400" />
                    <span>{(speed * 100).toFixed(0)} km/h</span>
                </div>
            )}

            {/* Game Content */}
            <div className="relative w-full max-w-md mx-auto h-full">

                {/* Obstacles */}
                {obstacles.map(obs => (
                    <div
                        key={obs.id}
                        className="absolute flex justify-center items-center w-1/3"
                        style={{
                            left: `${obs.lane * LANE_WIDTH_PERCENT}%`,
                            top: `${obs.y}%`,
                            height: '10%'
                        }}
                    >
                        <div className={`p-2 rounded-lg ${obs.type === 'cone' ? 'bg-orange-500/20' : 'bg-red-500/20'}`}>
                            {obs.type === 'cone'
                                ? <AlertTriangle className="w-8 h-8 text-orange-500 max-w-full" />
                                : <div className="w-8 h-8 bg-red-600 border-2 border-white flex items-center justify-center font-bold text-white text-xs">STOP</div>
                            }
                        </div>
                    </div>
                ))}

                {/* Player Car */}
                <motion.div
                    className="absolute bottom-4 w-1/3 flex justify-center items-center z-10"
                    animate={{ left: `${lane * LANE_WIDTH_PERCENT}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className="relative">
                        <Car className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" fill="currentColor" />
                        {/* Headlights */}
                        <div className="absolute -top-4 left-1 w-2 h-12 bg-yellow-200/30 blur-sm rounded-full" />
                        <div className="absolute -top-4 right-1 w-2 h-12 bg-yellow-200/30 blur-sm rounded-full" />
                        {/* Engine Glow */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-blue-500 blur-md animate-pulse" />
                    </div>
                </motion.div>

            </div>

            {/* Overlays */}
            <AnimatePresence>
                {!isPlaying && !isGameOver && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-30"
                    >
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-widest">Mini Racing</h3>
                            <button
                                onClick={(e) => { e.stopPropagation(); startGame(); }}
                                className="group flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-black rounded-full hover:scale-105 transition-transform"
                            >
                                <Play className="w-5 h-5 fill-black" />
                                START ENGINE
                            </button>
                            <p className="text-white/40 text-xs mt-4 animate-pulse">Press Arrow Keys or Swipe</p>
                        </div>
                    </motion.div>
                )}

                {isGameOver && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/80 backdrop-blur-md z-40"
                    >
                        <h2 className="text-3xl font-black text-white mb-2 drop-shadow-lg">GAME OVER</h2>
                        <div className="text-xl text-yellow-300 font-mono mb-4">Score: {score}</div>
                        <button
                            onClick={(e) => { e.stopPropagation(); startGame(); }}
                            className="px-8 py-3 bg-white text-red-600 font-bold rounded-lg hover:bg-gray-100 shadow-xl transition-all"
                        >
                            PLAY AGAIN
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
