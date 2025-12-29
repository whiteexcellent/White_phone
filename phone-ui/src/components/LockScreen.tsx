import { useState, useEffect } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import { motion } from 'framer-motion';
import { Camera, Flashlight } from 'lucide-react';

export default function LockScreen() {
    const { unlock } = usePhoneStore();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-between py-16 text-white select-none">
            {/* Top Section: Time & Date */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center text-center mt-12"
            >
                <span className="text-xl font-medium tracking-tight opacity-90 mb-1">
                    {formatDate(time)}
                </span>
                <h1 className="text-[84px] font-bold tracking-tighter leading-none">
                    {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </h1>
            </motion.div>

            {/* Notification Summary (Mock) */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-vibrant rounded-[24px] p-4 w-[85%] flex items-center gap-4 pressable"
            >
                <div className="w-12 h-12 rounded-[12px] bg-phone-accent flex items-center justify-center text-2xl">
                    💬
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                        <span className="font-semibold text-sm">Messages</span>
                        <span className="text-[11px] opacity-60">now</span>
                    </div>
                    <p className="text-sm opacity-90 line-clamp-1">John Doe: "Hey, see you tonight!"</p>
                </div>
            </motion.div>

            {/* Bottom Section: Quick Actions & Unlock */}
            <div className="w-full px-10 flex flex-col items-center gap-10">
                <div className="w-full flex justify-between items-center">
                    <button className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center pressable-shrink border-[1px] border-white/10">
                        <Flashlight size={24} />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center pressable-shrink border-[1px] border-white/10">
                        <Camera size={24} />
                    </button>
                </div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={unlock}
                >
                    <div className="w-32 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            animate={{ x: ['-100%', '100%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        />
                    </div>
                    <span className="text-sm font-medium opacity-60 tracking-widest uppercase">
                        Swipe up to unlock
                    </span>
                </motion.div>
            </div>
        </div>
    );
}
