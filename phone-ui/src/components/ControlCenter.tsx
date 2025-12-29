import { useState } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import { Wifi, Bluetooth, Plane, Moon, Sun, Volume2, X, Battery, Settings, Airplay, Scan } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ControlCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const { wifi, setWifi, bluetooth, setBluetooth, airplaneMode, setAirplaneMode, doNotDisturb, setDoNotDisturb } = usePhoneStore();
    const [brightness, setBrightness] = useState(80);
    const [volume, setVolume] = useState(60);

    return (
        <>
            <div className="absolute top-0 right-0 w-32 h-16 z-[2000] cursor-pointer" onMouseDown={() => setIsOpen(true)} />

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[2100]"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ y: '-100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute top-0 left-0 right-0 z-[2200] p-6 pt-16 flex flex-col gap-4"
                        >
                            {/* Primary Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Connectivity Block */}
                                <div className="glass-vibrant rounded-[28px] p-4 grid grid-cols-2 gap-4">
                                    <RoundToggle
                                        icon={<Plane size={24} />}
                                        active={airplaneMode}
                                        onClick={() => setAirplaneMode(!airplaneMode)}
                                        activeBg="bg-ios-orange"
                                    />
                                    <RoundToggle
                                        icon={<Wifi size={24} />}
                                        active={wifi}
                                        onClick={() => setWifi(!wifi)}
                                        activeBg="bg-ios-blue"
                                    />
                                    <RoundToggle
                                        icon={<Bluetooth size={24} />}
                                        active={bluetooth}
                                        onClick={() => setBluetooth(!bluetooth)}
                                        activeBg="bg-ios-blue"
                                    />
                                    <RoundToggle
                                        icon={<Airplay size={24} />}
                                        active={false}
                                        onClick={() => { }}
                                        activeBg="bg-ios-green"
                                    />
                                </div>

                                {/* Media/Status Grid */}
                                <div className="grid grid-rows-2 gap-4">
                                    <div className="glass-vibrant rounded-[28px] p-4 flex items-center justify-center gap-4">
                                        <Moon
                                            size={26}
                                            className={doNotDisturb ? 'text-ios-yellow' : 'text-white/40'}
                                            onClick={() => setDoNotDisturb(!doNotDisturb)}
                                        />
                                    </div>
                                    <div className="glass-vibrant rounded-[28px] p-4 flex justify-between items-center px-6">
                                        <Scan size={24} className="text-white" />
                                        <Settings size={24} className="text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Sliders Block */}
                            <div className="grid grid-cols-2 gap-4 h-48">
                                {/* Brightness Vertical Slider */}
                                <div className="glass-vibrant rounded-[28px] relative overflow-hidden group">
                                    <div
                                        className="absolute bottom-0 w-full bg-white/90 transition-all duration-100 ease-out"
                                        style={{ height: `${brightness}%` }}
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-start pt-6 mix-blend-difference pointer-events-none">
                                        <Sun size={28} className="text-white" />
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={brightness}
                                        onChange={(e) => setBrightness(Number(e.target.value))}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </div>

                                {/* Volume Vertical Slider */}
                                <div className="glass-vibrant rounded-[28px] relative overflow-hidden">
                                    <div
                                        className="absolute bottom-0 w-full bg-white/90 transition-all duration-100 ease-out"
                                        style={{ height: `${volume}%` }}
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-start pt-6 mix-blend-difference pointer-events-none">
                                        <Volume2 size={28} className="text-white" />
                                    </div>
                                    <input
                                        type="range"
                                        min="0" max="100"
                                        value={volume}
                                        onChange={(e) => setVolume(Number(e.target.value))}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                </div>
                            </div>

                            {/* Quick Flash/Camera */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="glass-vibrant rounded-full aspect-square flex items-center justify-center pressable">
                                    <Battery size={24} className="text-white" />
                                </div>
                                <div className="glass-vibrant rounded-full aspect-square flex items-center justify-center pressable">
                                    <Airplay size={24} className="text-white" />
                                </div>
                                <div className="glass-vibrant rounded-full aspect-square flex items-center justify-center pressable bg-ios-blue">
                                    <X size={24} className="text-white" onClick={() => setIsOpen(false)} />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function RoundToggle({ icon, active, onClick, activeBg }: { icon: React.ReactNode; active: boolean; onClick: () => void; activeBg: string }) {
    return (
        <button
            onClick={onClick}
            className={`w-full aspect-square rounded-full flex items-center justify-center transition-all duration-300 pressable ${active ? activeBg : 'bg-white/10'
                }`}
        >
            <div className={active ? 'text-white' : 'text-white/60'}>
                {icon}
            </div>
        </button>
    );
}
