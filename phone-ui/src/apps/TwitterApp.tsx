import { useState } from 'react';
import {
    Twitter,
    Search,
    Bell,
    Mail,
    Plus,
    Heart,
    Repeat2,
    MessageCircle,
    Share,
    CheckCircle2,
    MoreHorizontal,
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_TWEETS = [
    {
        id: '1',
        user: 'Maze Bank',
        handle: 'mazebank',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=bank',
        content: 'Experience luxury banking like never before. Switch to Maze Bank Premium today and enjoy exclusive benefits across Los Santos. #MazeBank #Luxury',
        time: '2h',
        likes: 1240,
        retweets: 450,
        replies: 89,
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop'
    },
    {
        id: '2',
        user: 'LSPD Official',
        handle: 'LSPD',
        verified: true,
        avatar: 'https://i.pravatar.cc/150?u=police',
        content: 'Reminder: The speed limit on Great Ocean Highway is strictly enforced. Stay safe, Los Santos! 🚔',
        time: '4h',
        likes: 3400,
        retweets: 890,
        replies: 560
    }
];

export default function TwitterApp() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="h-full bg-white dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
            {/* Premium X Header */}
            <div className="pt-14 px-5 pb-3 border-b-[0.5px] border-black/5 dark:border-white/10 flex justify-between items-center glass-vibrant sticky top-0 z-50">
                <div className="w-8 h-8 rounded-full bg-ios-gray-6 dark:bg-ios-secondary flex items-center justify-center overflow-hidden">
                    <img src="https://i.pravatar.cc/150?u=me" className="w-full h-full object-cover" />
                </div>
                <Twitter size={24} className="text-black dark:text-white fill-current" />
                <div className="w-8 h-8 flex items-center justify-center">
                    <SettingsIcon />
                </div>
            </div>

            {/* Feed Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
                {/* Tab Selector */}
                <div className="flex border-b-[0.5px] border-black/5 dark:border-white/10 h-12">
                    <button className="flex-1 flex flex-col items-center justify-center relative">
                        <span className="text-sm font-bold">For you</span>
                        <div className="absolute bottom-0 w-14 h-1 bg-ios-blue rounded-full" />
                    </button>
                    <button className="flex-1 flex flex-col items-center justify-center opacity-50">
                        <span className="text-sm font-bold">Following</span>
                    </button>
                </div>

                {/* Tweets List */}
                <div className="divide-y-[0.5px] divide-black/5 dark:divide-white/10">
                    {MOCK_TWEETS.map((tweet) => (
                        <motion.div
                            key={tweet.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 flex gap-3"
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <img src={tweet.avatar} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <div className="flex items-center gap-1 min-w-0">
                                        <span className="font-bold truncate">{tweet.user}</span>
                                        {tweet.verified && <CheckCircle2 size={14} className="text-ios-blue fill-current" />}
                                        <span className="text-ios-gray text-sm truncate">@{tweet.handle} · {tweet.time}</span>
                                    </div>
                                    <MoreHorizontal size={18} className="text-ios-gray" />
                                </div>
                                <p className="text-ios-body mb-3">{tweet.content}</p>

                                {tweet.image && (
                                    <div className="rounded-2xl overflow-hidden border-[0.5px] border-black/10 dark:border-white/10 mb-3">
                                        <img src={tweet.image} className="w-full h-64 object-cover" />
                                    </div>
                                )}

                                <div className="flex justify-between items-center text-ios-gray pr-10">
                                    <div className="flex items-center gap-1.5 pressable group">
                                        <div className="p-2 rounded-full group-hover:bg-ios-blue/10 group-hover:text-ios-blue transition-colors">
                                            <MessageCircle size={18} />
                                        </div>
                                        <span className="text-xs">{tweet.replies}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 pressable group">
                                        <div className="p-2 rounded-full group-hover:bg-ios-green/10 group-hover:text-ios-green transition-colors">
                                            <Repeat2 size={18} />
                                        </div>
                                        <span className="text-xs">{tweet.retweets}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 pressable group">
                                        <div className="p-2 rounded-full group-hover:bg-ios-red/10 group-hover:text-ios-red transition-colors">
                                            <Heart size={18} />
                                        </div>
                                        <span className="text-xs">{tweet.likes}</span>
                                    </div>
                                    <div className="p-2 rounded-full hover:bg-ios-blue/10 hover:text-ios-blue transition-colors pressable">
                                        <Share size={18} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modern Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute bottom-24 right-6 w-14 h-14 rounded-full bg-ios-blue shadow-ios-card flex items-center justify-center text-white z-[60]"
            >
                <Plus size={28} />
            </motion.button>

            {/* Premium Bottom Tab Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-20 glass-vibrant border-t-[0.5px] border-black/5 dark:border-white/10 flex justify-around items-center px-4 pb-4">
                <TabIcon active={activeTab === 'home'} icon={<HomeIcon active={activeTab === 'home'} />} onClick={() => setActiveTab('home')} />
                <TabIcon active={activeTab === 'search'} icon={<Search size={24} />} onClick={() => setActiveTab('search')} />
                <TabIcon active={activeTab === 'notifications'} icon={<Bell size={24} />} onClick={() => setActiveTab('notifications')} />
                <TabIcon active={activeTab === 'mail'} icon={<Mail size={24} />} onClick={() => setActiveTab('mail')} />
            </div>
        </div>
    );
}

function HomeIcon({ active }: { active: boolean }) {
    return (
        <div className="relative">
            <div className={`w-6 h-6 border-2 rounded-[4px] ${active ? 'border-current' : 'border-current opacity-70'}`} />
            <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${active ? 'bg-current' : 'bg-current opacity-70'}`} />
        </div>
    );
}

function SettingsIcon() {
    return (
        <div className="flex gap-[2px]">
            <div className="w-[3px] h-[3px] rounded-full bg-current" />
            <div className="w-[3px] h-[3px] rounded-full bg-current" />
            <div className="w-[3px] h-[3px] rounded-full bg-current" />
        </div>
    );
}

function TabIcon({ active, icon, onClick }: { active: boolean; icon: React.ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`p-3 transition-colors ${active ? 'text-black dark:text-white' : 'text-ios-gray'}`}
        >
            {icon}
        </button>
    );
}
