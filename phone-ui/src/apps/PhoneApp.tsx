import { useState } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import {
    Star,
    History,
    Users,
    Grid3X3,
    Voicemail,
    Phone,
    Video,
    Info,
    Delete,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
    { id: 'favorites', label: 'Favorites', icon: <Star size={22} /> },
    { id: 'recents', label: 'Recents', icon: <History size={22} /> },
    { id: 'contacts', label: 'Contacts', icon: <Users size={22} /> },
    { id: 'keypad', label: 'Keypad', icon: <Grid3X3 size={22} /> },
    { id: 'voicemail', label: 'Voicemail', icon: <Voicemail size={22} /> },
];

const MOCK_RECENTS = [
    { id: '1', name: 'John Doe', type: 'mobile', time: '10:45 AM', missed: true },
    { id: '2', name: 'Alice Smith', type: 'FaceTime', time: 'Yesterday', missed: false },
    { id: '3', name: 'Emergency', type: 'mobile', time: 'Tuesday', missed: false },
];

export default function PhoneApp() {
    const [activeTab, setActiveTab] = useState('keypad');
    const [number, setNumber] = useState('');

    const renderTab = () => {
        switch (activeTab) {
            case 'keypad':
                return (
                    <div className="flex flex-col items-center pt-10 px-10">
                        <div className="h-16 flex items-center justify-center mb-8">
                            <span className="text-[34px] font-medium tracking-tight whitespace-nowrap overflow-hidden">
                                {number}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-x-6 gap-y-4 w-full">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setNumber(prev => prev + val)}
                                    className="w-full aspect-square rounded-full bg-ios-gray-6 dark:bg-ios-secondary flex flex-col items-center justify-center pressable group"
                                >
                                    <span className="text-3xl font-medium">{val}</span>
                                    <span className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-[-2px]">
                                        {val === 2 ? 'ABC' : val === 3 ? 'DEF' : val === 4 ? 'GHI' : val === 5 ? 'JKL' : val === 6 ? 'MNO' : val === 7 ? 'PQRS' : val === 8 ? 'TUV' : val === 9 ? 'WXYZ' : ''}
                                    </span>
                                </button>
                            ))}

                            <div /> {/* Empty space */}
                            <button className="w-full aspect-square rounded-full bg-ios-green flex items-center justify-center text-white pressable shadow-lg">
                                <Phone size={34} fill="white" />
                            </button>
                            <button
                                onClick={() => setNumber(prev => prev.slice(0, -1))}
                                className="w-full aspect-square flex items-center justify-center text-ios-gray pressable"
                            >
                                {number && <Delete size={28} />}
                            </button>
                        </div>
                    </div>
                );

            case 'recents':
                return (
                    <div className="flex flex-col">
                        <div className="px-5 pt-14 pb-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-10">
                            <div className="flex justify-center mb-6">
                                <div className="bg-ios-gray-6 dark:bg-ios-secondary p-1 rounded-lg flex gap-1">
                                    <button className="px-6 py-1 bg-white dark:bg-ios-gray rounded-md shadow-sm text-sm font-semibold">All</button>
                                    <button className="px-6 py-1 text-sm font-semibold opacity-50">Missed</button>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold">Recents</h1>
                        </div>
                        <div className="flex-1 px-5">
                            {MOCK_RECENTS.map((recent) => (
                                <div key={recent.id} className="flex items-center gap-4 py-3 border-b-[0.5px] border-black/5 dark:border-white/5 pressable">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-lg font-bold ${recent.missed ? 'text-ios-red' : ''}`}>{recent.name}</span>
                                        </div>
                                        <div className="flex items-center gap-1 opacity-50">
                                            <Phone size={12} />
                                            <span className="text-sm">{recent.type}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm opacity-50">{recent.time}</span>
                                        <Info size={22} className="text-phone-accent" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex flex-col items-center justify-center h-full opacity-30">
                        <span className="text-6xl mb-4">📞</span>
                        <p className="font-medium capitalize">{activeTab} coming soon...</p>
                    </div>
                );
        }
    };

    return (
        <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col pb-20 overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar">
                {renderTab()}
            </div>

            {/* Modern iOS Tab Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-20 glass-vibrant flex justify-around items-center px-4 pb-4">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex flex-col items-center gap-1 flex-1 transition-all ${activeTab === tab.id ? 'text-phone-accent' : 'text-ios-gray'
                            }`}
                    >
                        {tab.icon}
                        <span className="text-[10px] font-medium">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
