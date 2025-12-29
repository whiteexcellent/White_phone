import { useState } from 'react';
import {
    ChevronLeft,
    Search,
    Plus,
    MoreHorizontal,
    Folder,
    FileText,
    Trash2,
    Share,
    CheckCircle2,
    Calendar,
    Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Note {
    id: string;
    title: string;
    content: string;
    date: string;
    color: string;
}

const MOCK_NOTES: Note[] = [
    { id: '1', title: 'Grove Street Meeting', content: 'Discuss the new shipment with Franklin at 8 PM. Bring the heat.', date: 'Dec 28, 2025', color: '#FFCC00' },
    { id: '2', title: 'Maze Bank PIN', content: 'Don\'t forget: 4815. High security account.', date: 'Dec 27, 2025', color: '#32D74B' },
    { id: '3', title: 'Shopping List', content: '1. Armor\n2. Ammo\n3. Medkits\n4. Snacks', date: 'Dec 25, 2025', color: '#FF9F0A' },
];

export default function NotesApp() {
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);

    if (selectedNote) {
        return (
            <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
                {/* Editor Header */}
                <div className="pt-14 px-5 pb-4 flex justify-between items-center glass-vibrant sticky top-0 z-50">
                    <button onClick={() => setSelectedNote(null)} className="text-phone-accent flex items-center gap-1 pressable">
                        <ChevronLeft size={28} />
                        <span className="text-lg">Notes</span>
                    </button>
                    <div className="flex gap-6 text-phone-accent">
                        <Share size={22} className="pressable" />
                        <CheckCircle2 size={22} className="pressable" onClick={() => setSelectedNote(null)} />
                        <MoreHorizontal size={22} className="pressable" />
                    </div>
                </div>

                {/* Editor Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <span className="text-xs font-bold opacity-30 uppercase tracking-widest">{selectedNote.date}</span>
                    <h1 className="text-3xl font-bold leading-tight outline-none" contentEditable>{selectedNote.title}</h1>
                    <div className="text-ios-body leading-relaxed opacity-80 outline-none min-h-[50%]" contentEditable>
                        {selectedNote.content}
                    </div>
                </div>

                {/* Editor Toolbar (Mock) */}
                <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t-[0.5px] border-black/5 dark:border-white/10 p-4 flex justify-around items-center pb-8">
                    <Grid size={22} className="text-ios-gray" />
                    <div className="w-[1px] h-6 bg-black/5 dark:bg-white/10" />
                    <FileText size={22} className="text-ios-gray" />
                    <Plus size={22} className="text-ios-gray" />
                    <Trash2 size={22} className="text-ios-red" />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
            {/* List Header */}
            <div className="pt-14 px-5 pb-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Notes</h1>
                    <button className="text-phone-accent font-medium text-lg">Edit</button>
                </div>
                <div className="bg-ios-gray-6 dark:bg-ios-secondary rounded-xl h-10 flex items-center px-3 gap-2">
                    <Search size={18} className="text-ios-gray" />
                    <span className="text-ios-gray font-medium">Search</span>
                </div>
            </div>

            {/* Folders/Notes Switcher */}
            <div className="flex-1 overflow-y-auto px-5 mt-4 space-y-6">
                <div className="bg-white dark:bg-[#1c1c1e] rounded-2xl shadow-sm divide-y-[0.5px] divide-black/5 dark:divide-white/5">
                    {MOCK_NOTES.map((note) => (
                        <div
                            key={note.id}
                            onClick={() => setSelectedNote(note)}
                            className="p-4 pressable flex flex-col gap-1 first:rounded-t-2xl last:rounded-b-2xl"
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: note.color }} />
                                <h3 className="font-bold text-lg truncate">{note.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 opacity-50">
                                <span className="text-sm font-medium">{note.date}</span>
                                <p className="text-sm truncate">{note.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="flex flex-col items-center gap-2 pt-4 opacity-30">
                    <Folder size={48} strokeWidth={1} />
                    <p className="font-bold text-sm tracking-widest uppercase">{MOCK_NOTES.length} Notes</p>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="h-20 glass-vibrant border-t-[0.5px] border-black/5 dark:border-white/10 flex justify-between items-center px-6 pb-6">
                <span className="text-[11px] font-bold opacity-30 tracking-widest uppercase">iCloud Integrated</span>
                <button
                    className="w-10 h-10 rounded-full bg-white dark:bg-ios-secondary flex items-center justify-center text-phone-accent shadow-sm pressable"
                >
                    <Plus size={24} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
