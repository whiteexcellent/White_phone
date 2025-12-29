import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhoneStore } from '../store/phoneStore';
import { Lock, Music, Phone as PhoneIcon } from 'lucide-react';

export default function DynamicIsland() {
    const { isLocked, currentApp } = usePhoneStore();
    const [state, setState] = useState<'idle' | 'face-id' | 'music' | 'call'>('idle');

    useEffect(() => {
        // State Machine Simulation
        if (isLocked) {
            // Simulate FaceID on lock screen
            const timeout = setTimeout(() => setState('face-id'), 500);
            const reset = setTimeout(() => setState('idle'), 2500); // Back to idle after unlock sim
            return () => { clearTimeout(timeout); clearTimeout(reset); };
        } else if (currentApp === 'music') {
            setState('music');
        } else if (currentApp === 'phone') {
            setState('call');
        } else {
            setState('idle');
        }
    }, [isLocked, currentApp]);

    const variants = {
        idle: { width: 120, height: 35, borderRadius: 20 },
        'face-id': { width: 150, height: 35, borderRadius: 20 },
        music: { width: 200, height: 45, borderRadius: 24 },
        call: { width: 180, height: 45, borderRadius: 24 },
    };

    return (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] flex justify-center">
            <motion.div
                layout
                initial="idle"
                animate={state}
                variants={variants}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="bg-black shadow-lg flex items-center justify-center overflow-hidden relative"
            >
                <AnimatePresence mode="wait">
                    {state === 'idle' && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full"
                        >
                            {/* Static Sensor Gaps */}
                        </motion.div>
                    )}

                    {state === 'face-id' && (
                        <motion.div
                            key="face-id"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-2 text-white"
                        >
                            <Lock size={14} className="text-ios-green" />
                            <span className="text-[10px] font-bold">Face ID</span>
                        </motion.div>
                    )}

                    {state === 'music' && (
                        <motion.div
                            key="music"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center justify-between w-full px-4 text-white"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-ios-gray rounded-md" /> {/* Tiny Album Art */}
                                <Music size={14} className="text-ios-blue" />
                            </div>
                            <div className="flex gap-[2px] items-end h-3">
                                {/* Audio Visualizer Bars */}
                                {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [4, 12, 4] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                        className="w-[3px] bg-white rounded-full bg-opacity-80"
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {state === 'call' && (
                        <motion.div
                            key="call"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-between w-full px-4 text-ios-green"
                        >
                            <div className="flex items-center gap-2">
                                <PhoneIcon size={14} fill="currentColor" />
                                <span className="text-[10px] font-bold text-white">00:15</span>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-ios-green animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
