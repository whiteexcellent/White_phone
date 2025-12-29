import { useState, useEffect } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import { Wifi, Signal, Battery, Moon } from 'lucide-react';

export default function StatusBar() {
    const { isLocked, doNotDisturb, battery } = usePhoneStore();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    return (
        <div className={`absolute top-0 left-0 right-0 h-[47px] flex items-center justify-between px-8 z-[1100] transition-colors duration-500 ${!isLocked ? 'text-white' : 'text-white'}`}>
            {/* Left: Time */}
            <div className="flex-1">
                <span className="text-[15px] font-semibold tracking-tight">
                    {formatTime(time)}
                </span>
            </div>

            {/* Center: Dynamic Island Gap (implicitly handled by absolute positioning of Dynamic Island in Phone.tsx) */}
            <div className="w-[125px]" />

            {/* Right: Icons */}
            <div className="flex-1 flex items-center justify-end gap-1.5">
                {doNotDisturb && <Moon size={14} fill="currentColor" className="mr-0.5" />}
                <Signal size={16} strokeWidth={2.5} />
                <Wifi size={16} strokeWidth={2.5} />
                <div className="flex items-center gap-1">
                    <span className="text-[12px] font-bold">{battery}%</span>
                    <div className="relative w-6 h-3 rounded-[3px] border-[1px] border-white/40 p-[1px]">
                        <div
                            className={`h-full rounded-[1px] ${battery <= 20 ? 'bg-ios-red' : 'bg-white'}`}
                            style={{ width: `${battery}%` }}
                        />
                        <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[4px] bg-white/40 rounded-r-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}
