import { motion } from 'framer-motion';
import { usePhoneStore } from '../store/phoneStore';
import {
    Phone,
    MessageCircle,
    Camera,
    Settings,
    Twitter,
    CreditCard,
    Mail,
    Calendar,
    Map,
    Music,
    FileText,
    AlertTriangle,
    Image as ImageIcon
} from 'lucide-react';

const APPS = [
    { id: 'phone', label: 'Phone', icon: <Phone size={32} />, color: '#34C759', isDock: true },
    { id: 'messages', label: 'Messages', icon: <MessageCircle size={32} />, color: '#007AFF', isDock: true },
    { id: 'twitter', label: 'X', icon: <Twitter size={32} />, color: '#000000', isDock: true },
    { id: 'bank', label: 'Wallet', icon: <CreditCard size={32} />, color: '#FF9500', isDock: true },

    { id: 'camera', label: 'Camera', icon: <Camera size={30} />, color: '#8E8E93' },
    { id: 'photos', label: 'Photos', icon: <ImageIcon size={30} />, color: '#FFFFFF', iconColor: '#FF3B30' },
    { id: 'mail', label: 'Mail', icon: <Mail size={30} />, color: '#007AFF' },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={30} />, color: '#FF3B30' },
    { id: 'maps', label: 'Maps', icon: <Map size={30} />, color: '#34C759' },
    { id: 'music', label: 'Music', icon: <Music size={30} />, color: '#FF2D55' },
    { id: 'notes', label: 'Notes', icon: <FileText size={30} />, color: '#FFCC00' },
    { id: 'settings', label: 'Settings', icon: <Settings size={30} />, color: '#8E8E93' },
    { id: 'emergency', label: '911', icon: <AlertTriangle size={30} />, color: '#FF3B30' },
];

export default function HomeScreen() {
    const { openApp } = usePhoneStore();

    // Stagger container
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const item = {
        hidden: { scale: 0.8, opacity: 0 },
        show: { scale: 1, opacity: 1, transition: { type: 'spring', damping: 15, stiffness: 200 } }
    };

    return (
        <div className="relative w-full h-full flex flex-col px-6 pt-16 pb-8 select-none">
            {/* Search Bar (Spotlight Style) */}
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="w-full glass rounded-[12px] h-10 mb-8 flex items-center px-4 gap-3 bg-white/10"
            >
                <span className="text-white/40 text-sm">Search</span>
            </motion.div>

            {/* App Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-4 gap-x-4 gap-y-7 px-2"
            >
                {APPS.filter(app => !app.isDock).map((app) => (
                    <div key={app.id} className="flex flex-col items-center gap-1 pressable" onClick={() => openApp(app.id)}>
                        <motion.div
                            layoutId={`app-icon-${app.id}`}
                            variants={item}
                            className="w-[60px] h-[60px] rounded-[14px] flex items-center justify-center shadow-ios-soft relative overflow-hidden group z-20"
                            style={{ backgroundColor: app.color }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent opacity-50" />
                            <div className="relative z-10" style={{ color: app.iconColor || 'white' }}>
                                {app.icon}
                            </div>
                            <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-10 transition-opacity" />
                        </motion.div>
                        <motion.span variants={item} className="text-[11px] font-medium text-white tracking-wide text-shadow-sm">
                            {app.label}
                        </motion.span>
                    </div>
                ))}
            </motion.div>

            {/* Dock */}
            <div className="mt-auto">
                <motion.div
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.2 }}
                    className="glass-vibrant rounded-[32px] p-3 flex justify-between items-center shadow-ios-card"
                >
                    {APPS.filter(app => app.isDock).map((app) => (
                        <div
                            key={app.id}
                            onClick={() => openApp(app.id)}
                            className="flex-1 flex justify-center cursor-pointer"
                        >
                            <motion.div
                                layoutId={`app-icon-${app.id}`} // Shared layout ID for seamless transition
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-[62px] h-[62px] rounded-[15px] flex items-center justify-center shadow-lg relative overflow-hidden z-20"
                                style={{ backgroundColor: app.color }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
                                <div className="relative z-10 text-white">
                                    {app.icon}
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
