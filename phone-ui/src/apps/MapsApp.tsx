import { useState } from 'react';
import {
    Search,
    MapPin,
    Navigation,
    Layers,
    Compass,
    ChevronRight,
    Star,
    Clock,
    Car
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_LOCATIONS = [
    { id: '1', name: 'Home', address: 'Grove Street, 12', time: '5m', icon: <MapPin size={18} />, color: 'bg-ios-blue' },
    { id: '2', name: 'Maze Bank Tower', address: 'Downtown LS', time: '12m', icon: <Star size={18} />, color: 'bg-ios-yellow' },
    { id: '3', name: 'LSC Custom Shop', address: 'Strawberry Ave', time: '8m', icon: <Car size={18} />, color: 'bg-ios-gray' },
];

export default function MapsApp() {
    const [isSearching, setIsSearching] = useState(false);

    return (
        <div className="h-full bg-slate-100 flex flex-col overflow-hidden relative">
            {/* Real Map Background Simulation */}
            <div
                className="absolute inset-0 bg-cover bg-center grayscale-[0.2] contrast-[1.1]"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2000&auto=format&fit=crop')` }}
            />

            {/* Map Overlays */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none" />

            {/* Top Search Bar */}
            <div className="absolute top-14 left-0 right-0 px-4 z-50">
                <div
                    onClick={() => setIsSearching(true)}
                    className="glass-strong rounded-[16px] h-12 flex items-center px-4 gap-3 bg-white/90 shadow-ios-soft pressable"
                >
                    <Search size={20} className="text-ios-gray" />
                    <span className="text-ios-gray font-medium text-[15px]">Search for a place or address</span>
                    <div className="ml-auto flex items-center gap-3">
                        <div className="w-[1px] h-5 bg-black/10" />
                        <Navigation size={20} className="text-ios-blue" />
                    </div>
                </div>
            </div>

            {/* Map Interactive Dots (Mock) */}
            <div className="absolute top-[40%] left-[30%] w-6 h-6 bg-ios-blue rounded-full border-4 border-white shadow-xl flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>

            {/* Floating Controls */}
            <div className="absolute bottom-40 right-4 flex flex-col gap-3 z-50">
                <button className="w-12 h-12 rounded-xl glass-strong bg-white/95 flex items-center justify-center text-ios-blue shadow-ios-soft pressable">
                    <Layers size={22} />
                </button>
                <button className="w-12 h-12 rounded-xl glass-strong bg-white/95 flex items-center justify-center text-ios-blue shadow-ios-soft pressable">
                    <Compass size={22} />
                </button>
            </div>

            {/* Bottom Sheet Card */}
            <div className="absolute bottom-0 left-0 right-0 z-[100]">
                <motion.div
                    initial={{ y: 200 }}
                    animate={{ y: 0 }}
                    className="glass-strong bg-white/95 rounded-t-[32px] p-6 pb-12 shadow-[0_-10px_30px_rgba(0,0,0,0.1)]"
                >
                    {/* Handle Bar */}
                    <div className="w-10 h-1.5 bg-black/10 rounded-full mx-auto mb-6" />

                    {/* Featured Locations */}
                    <div className="space-y-6">
                        <h3 className="text-[20px] font-bold">Recent Locations</h3>
                        <div className="space-y-4">
                            {MOCK_LOCATIONS.map((loc) => (
                                <div key={loc.id} className="flex items-center gap-4 pressable">
                                    <div className={`w-12 h-12 rounded-full ${loc.color} flex items-center justify-center text-white shadow-sm`}>
                                        {loc.icon}
                                    </div>
                                    <div className="flex-1 border-b-[0.5px] border-black/5 pb-2">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className="font-bold text-lg">{loc.name}</span>
                                            <span className="text-sm opacity-50 font-bold">{loc.time}</span>
                                        </div>
                                        <p className="text-sm opacity-50 font-medium truncate">{loc.address}</p>
                                    </div>
                                    <ChevronRight size={20} className="text-ios-gray opacity-40" />
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Search Modal Overlay */}
            <AnimatePresence>
                {isSearching && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed inset-0 bg-white dark:bg-black z-[200] p-6 pt-14"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 bg-ios-gray-6 dark:bg-ios-secondary rounded-xl h-11 flex items-center px-4 gap-2">
                                <Search size={18} className="text-ios-gray" />
                                <input autoFocus placeholder="Where to?" className="bg-transparent outline-none w-full text-lg" />
                            </div>
                            <button onClick={() => setIsSearching(false)} className="text-ios-blue font-bold">Cancel</button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-2 opacity-40">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase tracking-widest">Recent Searches</span>
                            </div>
                            <div className="space-y-4">
                                {['Police Station', 'Legion Square', 'Airport Terminal 4'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 py-2 border-b-[0.5px] border-black/5 dark:border-white/5">
                                        <MapPin size={20} className="text-ios-gray" />
                                        <span className="font-medium text-[17px]">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
