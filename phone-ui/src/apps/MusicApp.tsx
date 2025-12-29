import { useState } from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    Volume2,
    ListMusic,
    Heart,
    Share,
    MoreHorizontal,
    Plus,
    Repeat,
    Shuffle,
    Airplay,
    ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_CURRENT_SONG = {
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy (Deluxe)',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop',
    color: '#ED1C24'
};

const QUEUE = [
    { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', time: '3:20' },
    { id: '2', title: 'Save Your Tears', artist: 'The Weeknd', time: '3:35' },
    { id: '3', title: 'The Hills', artist: 'The Weeknd', time: '4:02' },
];

export default function MusicApp() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(45);
    const [showQueue, setShowQueue] = useState(false);

    return (
        <div className="h-full bg-black text-white flex flex-col overflow-hidden relative">
            {/* Dynamic Background Mesh Gradient */}
            <div
                className="absolute inset-0 opacity-40 blur-[100px] pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${MOCK_CURRENT_SONG.color}, transparent)`
                }}
            />

            <AnimatePresence mode="wait">
                {!showQueue ? (
                    <motion.div
                        key="nowplaying"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex-1 flex flex-col px-8 pt-16 z-10"
                    >
                        {/* Header Mini */}
                        <div className="flex justify-between items-center mb-10">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center pressable">
                                <Plus size={20} />
                            </div>
                            <span className="text-[13px] font-bold tracking-widest uppercase opacity-60">Now Playing</span>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center pressable" onClick={() => setShowQueue(true)}>
                                <ListMusic size={20} />
                            </div>
                        </div>

                        {/* Album Art */}
                        <motion.div
                            layoutId="album-art"
                            className="w-full aspect-square rounded-[24px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-12"
                        >
                            <img src={MOCK_CURRENT_SONG.cover} className="w-full h-full object-cover" />
                        </motion.div>

                        {/* Song Info */}
                        <div className="flex justify-between items-end mb-8">
                            <div className="flex flex-col gap-1 min-w-0">
                                <h1 className="text-[26px] font-bold tracking-tight truncate">{MOCK_CURRENT_SONG.title}</h1>
                                <p className="text-[19px] font-medium opacity-60 truncate">{MOCK_CURRENT_SONG.artist}</p>
                            </div>
                            <Heart size={26} className="text-white/40 pressable" />
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2 mb-10">
                            <div className="h-[5px] w-full bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-white rounded-full relative"
                                >
                                    <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg" />
                                </motion.div>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold opacity-40">
                                <span>1:42</span>
                                <span>3:48</span>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex justify-between items-center mb-12 px-2">
                            <SkipBack size={38} fill="currentColor" className="pressable" />
                            <button
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="w-20 h-20 rounded-full bg-white flex items-center justify-center pressable shadow-xl"
                            >
                                {isPlaying ? <Pause size={42} fill="black" className="text-black" /> : <Play size={42} fill="black" className="text-black ml-1" />}
                            </button>
                            <SkipForward size={38} fill="currentColor" className="pressable" />
                        </div>

                        {/* Volume & Airplay */}
                        <div className="flex items-center gap-4 opacity-40 mb-10">
                            <Volume2 size={20} />
                            <div className="flex-1 h-[4px] bg-white/30 rounded-full" />
                            <Airplay size={20} />
                        </div>

                        {/* Extra Controls */}
                        <div className="flex justify-around items-center opacity-60">
                            <Repeat size={18} />
                            <Share size={18} />
                            <Shuffle size={18} />
                            <MoreHorizontal size={18} />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="queue"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="flex-1 flex flex-col p-6 pt-16 z-10"
                    >
                        <button onClick={() => setShowQueue(false)} className="flex items-center gap-2 text-white/50 mb-8 pressable">
                            <ChevronLeft size={24} />
                            <span className="font-bold">Now Playing</span>
                        </button>

                        <h2 className="text-3xl font-bold mb-6">Up Next</h2>
                        <div className="space-y-4">
                            {QUEUE.map((song) => (
                                <div key={song.id} className="flex gap-4 items-center pressable hover:bg-white/5 p-2 rounded-xl transition-colors">
                                    <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                                        <img src={MOCK_CURRENT_SONG.cover} className="w-full h-full object-cover blur-[2px]" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold">{song.title}</h4>
                                        <p className="text-xs opacity-50">{song.artist}</p>
                                    </div>
                                    <span className="text-xs opacity-30 font-bold">{song.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
