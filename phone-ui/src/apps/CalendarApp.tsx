import { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Plus,
    Search,
    MapPin,
    Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_EVENTS = [
    { id: '1', title: 'Meeting with Lester', time: '14:00 - 15:30', location: 'Darnell\'s Warehouse', color: 'bg-ios-red' },
    { id: '2', title: 'Car Meet at Pier', time: '19:00 - 21:00', location: 'Del Perro Pier', color: 'bg-ios-blue' },
    { id: '3', title: 'Nightclub Shift', time: '22:00 - 04:00', location: 'Bahama Mamas', color: 'bg-ios-green' },
];

export default function CalendarApp() {
    const [selectedDay, setSelectedDay] = useState(29);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
            {/* Calendar Header */}
            <div className="pt-14 px-5 pb-4 border-b-[0.5px] border-black/5 dark:border-white/10 glass-vibrant sticky top-0 z-50">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <span className="text-ios-red font-bold text-[28px]">December</span>
                        <span className="text-ios-gray font-medium text-[28px]">2025</span>
                    </div>
                    <div className="flex gap-4 text-ios-red">
                        <Search size={22} className="pressable" />
                        <Plus size={22} className="pressable" />
                    </div>
                </div>

                {/* Days Strip */}
                <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-2 px-1">
                    {days.slice(selectedDay - 4, selectedDay + 3).map((day) => (
                        <div
                            key={day}
                            onClick={() => setSelectedDay(day)}
                            className={`flex flex-col items-center gap-1 min-w-[45px] py-2 rounded-xl transition-all pressable ${selectedDay === day ? 'bg-ios-red text-white shadow-ios-soft' : ''
                                }`}
                        >
                            <span className={`text-[11px] font-bold uppercase opacity-60 ${selectedDay === day ? 'text-white' : ''}`}>
                                {day % 7 === 0 ? 'SUN' : day % 7 === 1 ? 'MON' : 'TUE'}
                            </span>
                            <span className="text-[19px] font-bold">{day}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Schedule View */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">
                <div className="flex items-center gap-4">
                    <div className="flex-col flex items-start">
                        <span className="text-[13px] font-bold opacity-40 uppercase tracking-widest">Today</span>
                        <h2 className="text-2xl font-bold">Monday, Dec 29</h2>
                    </div>
                </div>

                {/* Timeline Events */}
                <div className="space-y-4">
                    {MOCK_EVENTS.map((event) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-4"
                        >
                            <div className="flex flex-col items-center gap-2 pt-1 w-12">
                                <span className="text-[13px] font-bold">{event.time.split(' - ')[0]}</span>
                                <div className="w-[1px] h-16 bg-black/5 dark:bg-white/10" />
                            </div>

                            <div className={`flex-1 ${event.color} bg-opacity-10 rounded-[14px] p-4 border-l-[4px] ${event.color.replace('bg-', 'border-')} shadow-sm pressable`}>
                                <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                                <div className="flex flex-col gap-1 opacity-60">
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <Clock size={12} />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                                        <MapPin size={12} />
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* No more events indicator */}
                <div className="flex flex-col items-center gap-2 pt-10 opacity-20">
                    <CalendarIcon size={48} strokeWidth={1} />
                    <p className="font-medium">No more events for today</p>
                </div>
            </div>

            {/* Tab Bar Mini */}
            <div className="h-20 glass-vibrant flex justify-around items-center px-4 pb-6 border-t-[0.5px] border-black/5 dark:border-white/10">
                <button className="text-ios-red font-bold text-sm">Today</button>
                <button className="text-ios-gray font-medium text-sm">Calendars</button>
                <button className="text-ios-gray font-medium text-sm">Inbox</button>
            </div>
        </div>
    );
}
