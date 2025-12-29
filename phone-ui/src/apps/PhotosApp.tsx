import { useState } from 'react';
import {
    Search,
    Heart,
    Share,
    Trash2,
    ChevronLeft,
    Layers,
    MoreHorizontal,
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PHOTOS = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1449034446853-66c86144b0ad',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
    'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716'
];

export default function PhotosApp() {
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('library');

    return (
        <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
            {/* Photos Library Header */}
            {!selectedPhoto && (
                <div className="pt-14 px-5 pb-4 glass-vibrant sticky top-0 z-50">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Library</h1>
                        <button className="text-phone-accent font-medium">Select</button>
                    </div>
                    <div className="flex bg-ios-gray-6 dark:bg-ios-secondary p-1 rounded-lg">
                        <button className="flex-1 py-1.5 text-[13px] font-bold bg-white dark:bg-ios-gray rounded-md shadow-sm">Years</button>
                        <button className="flex-1 py-1.5 text-[13px] font-bold opacity-50">Months</button>
                        <button className="flex-1 py-1.5 text-[13px] font-bold opacity-50">Days</button>
                        <button className="flex-1 py-1.5 text-[13px] font-bold opacity-50">All Photos</button>
                    </div>
                </div>
            )}

            {/* Photo Grid */}
            {!selectedPhoto && (
                <div className="flex-1 overflow-y-auto no-scrollbar pt-2">
                    <div className="grid grid-cols-4 gap-[2px]">
                        {MOCK_PHOTOS.map((photo, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => setSelectedPhoto(photo)}
                                className="aspect-square relative group pressable"
                            >
                                <img
                                    src={`${photo}?q=60&w=300&auto=format&fit=crop`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-white opacity-0 group-active:opacity-20 transition-opacity" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Fullscreen Photo Viewer */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="fixed inset-0 bg-white dark:bg-black z-[100] flex flex-col"
                    >
                        {/* Top Bar */}
                        <div className="pt-14 px-5 pb-4 flex justify-between items-center">
                            <button onClick={() => setSelectedPhoto(null)} className="text-phone-accent">
                                <ChevronLeft size={28} />
                            </button>
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-bold uppercase tracking-widest">Today</span>
                                <span className="text-[10px] opacity-60">10:45 AM</span>
                            </div>
                            <button className="text-phone-accent">
                                <MoreHorizontal size={24} />
                            </button>
                        </div>

                        {/* Main Image */}
                        <div className="flex-1 flex items-center justify-center p-2">
                            <motion.img
                                layoutId={`photo-${selectedPhoto}`}
                                src={`${selectedPhoto}?q=80&w=1200&auto=format&fit=crop`}
                                className="max-w-full max-h-[80%] rounded-lg shadow-2xl"
                            />
                        </div>

                        {/* Bottom Tools */}
                        <div className="pb-10 px-8 flex justify-between items-center text-phone-accent">
                            <Share size={24} className="pressable" />
                            <Heart size={24} className="pressable" />
                            <div className="flex flex-col items-center gap-1 opacity-50">
                                <span className="text-[10px] font-bold text-black dark:text-white">EDIT</span>
                            </div>
                            <ImageIcon size={24} className="pressable opacity-50" />
                            <Trash2 size={24} className="pressable text-ios-red" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Library Tabs */}
            {!selectedPhoto && (
                <div className="h-20 glass-vibrant flex justify-around items-center px-4 pb-4">
                    <LibraryTab active={activeTab === 'library'} icon={<ImageIcon size={24} />} label="Library" onClick={() => setActiveTab('library')} />
                    <LibraryTab active={activeTab === 'foryou'} icon={<Heart size={24} />} label="For You" onClick={() => setActiveTab('foryou')} />
                    <LibraryTab active={activeTab === 'albums'} icon={<Layers size={24} />} label="Albums" onClick={() => setActiveTab('albums')} />
                    <LibraryTab active={activeTab === 'search'} icon={<Search size={24} />} label="Search" onClick={() => setActiveTab('search')} />
                </div>
            )}
        </div>
    );
}

function LibraryTab({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-phone-accent' : 'text-ios-gray'}`}
        >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </button>
    );
}
