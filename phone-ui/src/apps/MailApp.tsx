import { useState } from 'react';
import {
    Inbox,
    Star,
    Send,
    Trash2,
    ChevronLeft,
    Search,
    Plus,
    MoreHorizontal,
    Archive,
    Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_EMAILS = [
    { id: '1', sender: 'Maze Bank', subject: 'Your Monthly Statement', body: 'Dear John, your statement for December 2025 is now available for review...', time: '10:45 AM', read: false, starred: true },
    { id: '2', sender: 'Dynasty 8', subject: 'New Property Listing', body: 'A new luxury apartment has been listed in Eclipse Towers. Check it out!', time: 'Yesterday', read: true, starred: false },
    { id: '3', sender: 'LSC Security', subject: 'Account Login Alert', body: 'We detected a new login to your account from a device in Paleto Bay.', time: 'Monday', read: true, starred: false },
];

export default function MailApp() {
    const [selectedMail, setSelectedMail] = useState<any>(null);

    if (selectedMail) {
        return (
            <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
                {/* Email Content Header */}
                <div className="pt-14 px-5 pb-4 border-b-[0.5px] border-black/5 dark:border-white/10 flex justify-between items-center glass-vibrant sticky top-0 z-50">
                    <button onClick={() => setSelectedMail(null)} className="text-phone-accent flex items-center gap-1 pressable">
                        <ChevronLeft size={28} />
                        <span className="text-lg">Inbox</span>
                    </button>
                    <div className="flex gap-6">
                        <Trash2 size={22} className="text-ios-red pressable" />
                        <Archive size={22} className="text-ios-gray pressable" />
                        <MoreHorizontal size={22} className="text-phone-accent pressable" />
                    </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-[28px] font-bold leading-tight">{selectedMail.subject}</h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-ios-blue flex items-center justify-center text-white font-bold">
                                    {selectedMail.sender[0]}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">{selectedMail.sender}</span>
                                    <span className="text-xs opacity-50">To: john@lsmail.com</span>
                                </div>
                            </div>
                            <span className="text-sm opacity-50">{selectedMail.time}</span>
                        </div>
                    </div>

                    <div className="text-ios-body leading-relaxed opacity-90">
                        {selectedMail.body}
                    </div>
                </div>

                {/* Reply Footer */}
                <div className="p-4 glass-vibrant border-t-[0.5px] border-black/5 dark:border-white/10 flex justify-around items-center pb-8">
                    <button className="flex flex-col items-center gap-1 opacity-50"><ChevronLeft className="rotate-0" size={24} /> <span className="text-[10px]">Reply</span></button>
                    <button className="flex flex-col items-center gap-1 opacity-50"><MoreHorizontal size={24} /> <span className="text-[10px]">More</span></button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
            {/* Inbox Header */}
            <div className="pt-14 px-5 pb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Inbox</h1>
                    <button className="text-phone-accent font-medium text-lg">Edit</button>
                </div>
                <div className="bg-ios-gray-6 dark:bg-ios-secondary rounded-xl h-10 flex items-center px-3 gap-2">
                    <Search size={18} className="text-ios-gray" />
                    <span className="text-ios-gray font-medium">Search</span>
                </div>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto divide-y-[0.5px] divide-black/5 dark:divide-white/10 mt-2">
                {MOCK_EMAILS.map((mail) => (
                    <div
                        key={mail.id}
                        onClick={() => setSelectedMail(mail)}
                        className="p-5 flex gap-4 pressable relative bg-white dark:bg-black"
                    >
                        <div className="flex flex-col items-center pt-1">
                            {!mail.read && <div className="w-2.5 h-2.5 bg-ios-blue rounded-full absolute -left-[-15px] top-[35px]" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className={`text-[17px] ${!mail.read ? 'font-bold' : 'font-medium opacity-60'}`}>
                                    {mail.sender}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm opacity-50">{mail.time}</span>
                                    <ChevronLeft size={16} className="rotate-180 opacity-20" />
                                </div>
                            </div>
                            <h3 className={`text-[15px] ${!mail.read ? 'font-semibold' : 'font-medium opacity-60'} mb-1`}>
                                {mail.subject}
                            </h3>
                            <p className="text-[14px] opacity-40 line-clamp-2 leading-snug">
                                {mail.body}
                            </p>
                        </div>
                        {mail.starred && <Star size={14} className="text-ios-yellow fill-current absolute right-5 bottom-5" />}
                    </div>
                ))}
            </div>

            {/* Mail Bottom Bar */}
            <div className="h-20 glass-vibrant flex justify-between items-center px-6 pb-6 border-t-[0.5px] border-black/5 dark:border-white/10">
                <span className="text-[11px] font-medium opacity-40 italic">Updated Just Now</span>
                <button className="text-phone-accent pressable">
                    <Plus size={24} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
