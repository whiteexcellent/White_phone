import { useState } from 'react';
import {
    AlertTriangle,
    MapPin,
    PhoneCall,
    Shield,
    HeartPulse,
    Flame,
    Info,
    ChevronRight,
    Navigation,
    Activity,
    User,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EmergencyApp() {
    const [calling, setCalling] = useState<string | null>(null);

    const SERVICES = [
        { id: 'police', label: 'Police Department', sub: 'LSPD Dispatch', icon: <Shield size={32} />, color: 'bg-ios-blue', action: 'Contact LSPD' },
        { id: 'ems', label: 'Medical Services', sub: 'LSMD Emergency', icon: <HeartPulse size={32} />, color: 'bg-ios-red', action: 'Contact EMS' },
        { id: 'fire', label: 'Fire Department', sub: 'LSFD Dispatch', icon: <Flame size={32} />, color: 'bg-ios-orange', action: 'Contact LSFD' },
    ];

    return (
        <div className="h-full bg-[#f2f2f7] dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
            {/* Emergency Header */}
            <div className="pt-16 px-6 pb-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="bg-ios-red/10 px-3 py-1 rounded-full flex items-center gap-2">
                        <div className="w-2 h-2 bg-ios-red rounded-full animate-pulse" />
                        <span className="text-ios-red font-bold text-xs uppercase tracking-widest">Active Dispatch</span>
                    </div>
                    <button className="text-ios-gray"><Info size={24} /></button>
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Emergency</h1>
                <p className="text-ios-gray font-medium mt-1">Select a service to request immediate assistance.</p>
            </div>

            {/* Services List */}
            <div className="flex-1 px-6 space-y-4 overflow-y-auto pb-10">
                {SERVICES.map((service) => (
                    <motion.div
                        key={service.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCalling(service.label)}
                        className="bg-white dark:bg-[#1c1c1e] rounded-[24px] p-5 shadow-sm flex items-center gap-5 pressable group border-[0.5px] border-black/5 dark:border-white/5"
                    >
                        <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center text-white shadow-lg`}>
                            {service.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold">{service.label}</h3>
                            <p className="text-sm opacity-50 font-medium">{service.sub}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#f2f2f7] dark:bg-ios-secondary flex items-center justify-center text-ios-gray group-active:text-ios-blue transition-colors">
                            <ChevronRight size={24} />
                        </div>
                    </motion.div>
                ))}

                {/* Location Info Card */}
                <div className="mt-8 bg-white dark:bg-[#1c1c1e] rounded-[24px] p-6 shadow-sm border-[0.5px] border-black/5 dark:border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-ios-green/10 flex items-center justify-center text-ios-green">
                            <MapPin size={18} />
                        </div>
                        <span className="font-bold text-sm tracking-widest uppercase opacity-60">Your Location</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">Del Perro Pier</h2>
                    <p className="text-ios-gray font-medium mb-4">Ocean Drive, LS · 120m from shore</p>
                    <div className="flex gap-3">
                        <button className="flex-1 py-3 bg-ios-blue rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 pressable shadow-ios-soft">
                            <Navigation size={18} /> Share GPS
                        </button>
                        <button className="w-14 h-12 bg-[#f2f2f7] dark:bg-ios-secondary rounded-xl flex items-center justify-center text-ios-gray pressable">
                            <Activity size={22} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Emergency Call Overlay */}
            <AnimatePresence>
                {calling && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between py-24 text-white"
                    >
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-24 h-24 rounded-full bg-ios-red flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(255,69,58,0.4)]">
                                <AlertTriangle size={48} />
                            </div>
                            <h2 className="text-3xl font-bold mt-4">Calling {calling}...</h2>
                            <p className="opacity-60 font-medium italic">Emergency Dispatch is responding</p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-12 gap-y-12">
                            <div className="flex flex-col items-center gap-2"><div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"><User size={28} /></div><span className="text-xs opacity-60">Identity</span></div>
                            <div className="flex flex-col items-center gap-2"><div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center"><Navigation size={28} /></div><span className="text-xs opacity-60">Location</span></div>
                        </div>

                        <button
                            onClick={() => setCalling(null)}
                            className="w-20 h-20 rounded-full bg-ios-red flex items-center justify-center pressable shadow-2xl"
                        >
                            <X size={40} strokeWidth={2.5} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
