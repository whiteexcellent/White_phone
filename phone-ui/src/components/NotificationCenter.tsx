import { useState } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationCenter() {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, removeNotification, clearNotifications } = usePhoneStore();

    return (
        <>
            <div className="absolute top-0 left-0 w-32 h-16 z-[2000] cursor-pointer" onMouseDown={() => setIsOpen(true)} />

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md z-[2100]"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ y: '-100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '-100%', opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute top-0 left-0 right-0 z-[2200] p-6 pt-16 h-full flex flex-col gap-6 overflow-hidden"
                        >
                            {/* Massive Time/Date in NC */}
                            <div className="flex flex-col items-center text-white py-4 opacity-100">
                                <span className="text-ios-title font-bold leading-tight">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                                <span className="text-ios-body font-medium opacity-80 mt-1">
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            {/* NC Header with Search */}
                            <div className="flex justify-between items-center mb-0 px-2">
                                <div className="bg-white/15 backdrop-blur-xl rounded-full px-4 py-1.5 flex items-center gap-2 flex-1 max-w-[200px]">
                                    <Search size={14} className="text-white/60" />
                                    <span className="text-white/60 text-sm font-medium">Search</span>
                                </div>
                                <div className="flex gap-4">
                                    {notifications.length > 0 && (
                                        <button onClick={clearNotifications} className="text-white/50 text-sm font-medium hover:text-white transition-colors">
                                            Clear All
                                        </button>
                                    )}
                                    <X size={24} className="text-white/40 pressable" onClick={() => setIsOpen(false)} />
                                </div>
                            </div>

                            {/* Notification List (iOS 17 Stack Style) */}
                            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full opacity-30 text-white">
                                        <span className="text-4xl mb-4">🔔</span>
                                        <p className="font-medium">No older notifications</p>
                                    </div>
                                ) : (
                                    <motion.div layout className="flex flex-col gap-3">
                                        {notifications.map((notif, index) => (
                                            <motion.div
                                                key={notif.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, x: 100 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="glass-vibrant rounded-[24px] p-4 relative overflow-hidden pressable shadow-ios-soft"
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div
                                                        className="w-10 h-10 rounded-[10px] flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
                                                        style={{ backgroundColor: notif.appColor }}
                                                    >
                                                        <span className="relative z-10">{notif.appIcon}</span>
                                                        <div className="absolute inset-0 bg-black/10" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <span className="text-white font-bold text-[13px] tracking-wide uppercase opacity-70">
                                                                {notif.appName}
                                                            </span>
                                                            <span className="text-white/50 text-[11px] font-medium">{notif.time}</span>
                                                        </div>
                                                        <div className="text-white font-semibold text-ios-body mb-0.5">
                                                            {notif.title}
                                                        </div>
                                                        <div className="text-white/80 text-sm leading-snug line-clamp-2">
                                                            {notif.body}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeNotification(notif.id); }}
                                                        className="bg-white/10 p-1.5 rounded-full text-white/40 hover:text-white transition-all"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
