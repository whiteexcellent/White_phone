import { useState } from 'react';
import {
    Wifi,
    Bluetooth,
    Plane,
    Moon,
    Sun,
    Volume2,
    Bell,
    Lock,
    Smartphone,
    ChevronRight,
    Shield,
    Wallpaper,
    Search,
    Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsApp() {
    const [activeTab, setActiveTab] = useState<string | null>(null);

    const SETTINGS_GROUPS = [
        {
            items: [
                { id: 'airplane', label: 'Airplane Mode', icon: <Plane className="text-white" />, bg: 'bg-ios-orange', type: 'toggle' },
                { id: 'wifi', label: 'Wi-Fi', icon: <Wifi className="text-white" />, bg: 'bg-ios-blue', value: 'Home_5G' },
                { id: 'bluetooth', label: 'Bluetooth', icon: <Bluetooth className="text-white" />, bg: 'bg-ios-blue', value: 'On' },
                { id: 'mobile', label: 'Mobile Data', icon: <Smartphone className="text-white" />, bg: 'bg-ios-green' },
            ]
        },
        {
            items: [
                { id: 'notifications', label: 'Notifications', icon: <Bell className="text-white" />, bg: 'bg-ios-red' },
                { id: 'sound', label: 'Sounds & Haptics', icon: <Volume2 className="text-white" />, bg: 'bg-ios-red' },
                { id: 'focus', label: 'Focus', icon: <Moon className="text-white" />, bg: 'bg-ios-blue' },
            ]
        },
        {
            items: [
                { id: 'general', label: 'General', icon: <Settings className="text-white" />, bg: 'bg-ios-gray' },
                { id: 'wallpaper', label: 'Wallpaper', icon: <Wallpaper className="text-white" />, bg: 'bg-ios-blue' },
                { id: 'security', label: 'FaceID & Passcode', icon: <Shield className="text-white" />, bg: 'bg-ios-green' },
                { id: 'privacy', label: 'Privacy & Security', icon: <Lock className="text-white" />, bg: 'bg-ios-blue' },
            ]
        }
    ];

    return (
        <div className="h-full bg-[#f2f2f7] dark:bg-black text-black dark:text-white overflow-hidden flex flex-col">
            {/* Search Header */}
            <div className="pt-14 px-5 pb-4">
                <h1 className="text-3xl font-bold mb-4">Settings</h1>
                <div className="bg-white dark:bg-[#1c1c1e] rounded-xl h-10 flex items-center px-3 gap-2 shadow-sm">
                    <Search size={18} className="text-ios-gray" />
                    <span className="text-ios-gray">Search</span>
                </div>
            </div>

            {/* Settings Sections */}
            <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-8">
                {/* User Card */}
                <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl p-4 flex items-center gap-4 shadow-sm pressable">
                    <div className="w-14 h-14 rounded-full bg-ios-blue flex items-center justify-center text-2xl font-bold text-white">
                        JD
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold">John Doe</h2>
                        <p className="text-sm opacity-60">Apple ID, iCloud+, Media & Purchases</p>
                    </div>
                    <ChevronRight className="text-ios-gray" size={20} />
                </div>

                {SETTINGS_GROUPS.map((group, gIdx) => (
                    <div key={gIdx} className="bg-white dark:bg-[#1c1c1e] rounded-2xl overflow-hidden shadow-sm">
                        {group.items.map((item, iIdx) => (
                            <div
                                key={item.id}
                                className={`flex items-center gap-3 p-3 pressable ${iIdx !== group.items.length - 1 ? 'border-b-[0.5px] border-black/5 dark:border-white/5' : ''}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg}`}>
                                    {item.icon}
                                </div>
                                <span className="flex-1 font-medium">{item.label}</span>
                                {item.value && <span className="text-ios-gray text-sm">{item.value}</span>}
                                <ChevronRight className="text-ios-gray" size={18} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            {/* Sub-page Overlay (Animated) */}
            <AnimatePresence>
                {activeTab && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-[#f2f2f7] dark:bg-black z-[100] p-6 pt-16"
                    >
                        <div className="flex items-center gap-2 mb-8 text-ios-blue pressable" onClick={() => setActiveTab(null)}>
                            <ChevronRight className="rotate-180" size={24} />
                            <span className="text-lg font-medium">Settings</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-6 capitalize">{activeTab}</h2>
                        <div className="flex flex-col items-center justify-center h-1/2 opacity-30">
                            <span className="text-6xl mb-4">⚙️</span>
                            <p className="font-medium">Details coming soon...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
