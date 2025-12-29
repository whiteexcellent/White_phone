import { useEffect, useState } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import { onNuiMessage, sendNuiMessage } from '../utils/nui';
import LockScreen from './LockScreen';
import HomeScreen from './HomeScreen';
import AppContainer from './AppContainer';
import StatusBar from './StatusBar';
import ControlCenter from './ControlCenter';
import NotificationCenter from './NotificationCenter';
import DynamicIsland from './DynamicIsland';
import { motion, AnimatePresence } from 'framer-motion';
import './Phone.css';

export default function Phone() {
    const { isOpen, isLocked, currentApp } = usePhoneStore();
    const [reflectionPos, setReflectionPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const unsubOpen = onNuiMessage('open', () => usePhoneStore.getState().setIsOpen(true));
        const unsubClose = onNuiMessage('close', () => usePhoneStore.getState().setIsOpen(false));

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (currentApp) usePhoneStore.getState().closeApp();
                else if (!isLocked) usePhoneStore.getState().lock();
                else sendNuiMessage('closePhone');
            }
        };

        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setReflectionPos({ x, y });
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            unsubOpen();
            unsubClose();
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [currentApp, isLocked]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="phone-wrapper relative group"
        >
            {/* High-Fidelity Bezel & Frame */}
            <div className="absolute inset-[-12px] rounded-[65px] border-[6px] border-[#1a1a1a] bg-[#0c0c0c] shadow-[0_0_0_4px_#333,0_30px_60px_-12px_rgba(0,0,0,0.8)] z-0" />

            {/* Premium Glass Reflection Effect */}
            <div
                className="absolute inset-0 rounded-[55px] pointer-events-none z-[500] opacity-30 overflow-hidden"
                style={{
                    background: `linear-gradient(${135 + reflectionPos.x}deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.05) 100%)`
                }}
            />

            {/* Main Content Area */}
            <div className="relative w-full h-full rounded-[55px] overflow-hidden bg-black z-10">
                {/* Dynamic Island */}
                <DynamicIsland />

                {/* Wallpaper Layer with Parallax */}
                <div
                    className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-in-out ${!isLocked ? 'scale-110 blur-xl brightness-50' : 'scale-100'}`}
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')`,
                        transform: `translate(${reflectionPos.x / 4}px, ${reflectionPos.y / 4}px) scale(${!isLocked ? 1.2 : 1.1})`
                    }}
                />

                {/* System Overlays */}
                <StatusBar />
                <ControlCenter />
                <NotificationCenter />

                {/* Dynamic Screens */}
                <AnimatePresence mode="wait">
                    {isLocked ? (
                        <motion.div
                            key="lockscreen"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 z-20"
                        >
                            <LockScreen />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="homescreen"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute inset-0 z-10"
                        >
                            <HomeScreen />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* App Layer */}
                <AnimatePresence>
                    {currentApp && (
                        <motion.div
                            initial={{ y: '100%', opacity: 0.5 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0.5 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute inset-0 z-50 overflow-hidden rounded-[55px]"
                        >
                            <AppContainer />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Smooth Home Indicator */}
                <motion.div
                    whileHover={{ height: 6, opacity: 0.8 }}
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/40 rounded-full z-[1000] cursor-pointer pressable"
                    onClick={() => usePhoneStore.getState().goHome()}
                />
            </div>
        </motion.div>
    );
}
