import { useState, useEffect, useRef } from 'react';
import {
    Camera,
    RotateCcw,
    Zap,
    ZapOff,
    ChevronUp,
    Image as ImageIcon,
    Circle,
    Video,
    Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CAMERA_MODES = ['CINEMATIC', 'VIDEO', 'PHOTO', 'PORTRAIT', 'PANO'];

export default function CameraApp() {
    const [flash, setFlash] = useState(false);
    const [mode, setMode] = useState('PHOTO');
    const [isCapturing, setIsCapturing] = useState(false);
    const viewfinderRef = useRef<HTMLDivElement>(null);

    const handleCapture = () => {
        setIsCapturing(true);
        setTimeout(() => setIsCapturing(false), 150);
        // Trigger NUI photo capture here in future
    };

    return (
        <div className="h-full bg-black text-white flex flex-col overflow-hidden select-none">
            {/* Viewfinder Area */}
            <div className="relative flex-1 bg-neutral-900 overflow-hidden flex items-center justify-center">
                {/* Mock Viewfinder Background (Realistic Blur/Texture) */}
                <div
                    className="absolute inset-0 opacity-40 bg-cover bg-center"
                    style={{ backgroundImage: `url('https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=2670&auto=format&fit=crop')` }}
                />

                {/* Viewfinder UI Overlays */}
                <div className="absolute inset-0 border-[0.5px] border-white/5 pointer-events-none" />

                {/* Focus Box Simulation */}
                <motion.div
                    initial={{ scale: 1.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="w-20 h-20 border-[0.5px] border-ios-yellow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[2px]"
                />

                {/* Top Controls */}
                <div className="absolute top-14 left-0 right-0 px-6 flex justify-between items-center z-50">
                    <button onClick={() => setFlash(!flash)} className="p-2 rounded-full bg-black/20 backdrop-blur-md pressable">
                        {flash ? <Zap size={20} className="text-ios-yellow fill-current" /> : <ZapOff size={20} />}
                    </button>
                    <button className="flex items-center gap-1.5 p-2 px-4 rounded-full bg-black/20 backdrop-blur-md text-[13px] font-semibold pressable">
                        4K · 60
                        <ChevronUp size={14} className="opacity-60" />
                    </button>
                    <div className="w-10 h-10" /> {/* Spacer */}
                </div>

                {/* Capture Flash Overlay */}
                <AnimatePresence>
                    {isCapturing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-white z-[100]"
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom Controls Area */}
            <div className="h-64 bg-black flex flex-col items-center justify-between pb-10 pt-4">
                {/* Mode Selector */}
                <div className="w-full relative overflow-hidden h-10 flex items-center justify-center">
                    <div className="flex gap-6 px-10">
                        {CAMERA_MODES.map((m) => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`text-[13px] font-bold tracking-widest transition-colors ${mode === m ? 'text-ios-yellow' : 'text-white/40'
                                    }`}
                            >
                                {m}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Shutter Section */}
                <div className="w-full px-12 flex items-center justify-between">
                    <button className="w-12 h-12 rounded-lg border-2 border-white/20 overflow-hidden pressable">
                        <img
                            src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?q=80&w=100&auto=format&fit=crop"
                            className="w-full h-full object-cover"
                        />
                    </button>

                    <button
                        onClick={handleCapture}
                        className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1.5 pressable"
                    >
                        <div className={`w-full h-full rounded-full transition-all duration-200 ${mode === 'VIDEO' ? 'bg-ios-red scale-75 rounded-lg' : 'bg-white'}`} />
                    </button>

                    <button className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center pressable">
                        <RotateCcw size={26} className="text-white" />
                    </button>
                </div>

                {/* Zoom Controls */}
                <div className="flex gap-4">
                    <ZoomBtn label=".5" />
                    <ZoomBtn label="1x" active />
                    <ZoomBtn label="2" />
                </div>
            </div>
        </div>
    );
}

function ZoomBtn({ label, active }: any) {
    return (
        <button className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border-[1.5px] transition-all ${active ? 'bg-white text-black border-white' : 'bg-black/40 text-white/60 border-white/20'
            }`}>
            {label}
        </button>
    );
}
