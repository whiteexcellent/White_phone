import { useState, useRef, useEffect } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import {
    ChevronLeft,
    MoreVertical,
    Camera,
    Mic,
    Plus,
    Send,
    User,
    Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    sender: 'me' | 'them';
    text: string;
    time: string;
}

interface Conversation {
    id: string;
    contact: string;
    lastMessage: string;
    time: string;
    unread: boolean;
    avatar?: string;
}

const MOCK_CONVERSATIONS: Conversation[] = [
    { id: '1', contact: 'John Doe', lastMessage: 'Hey, are you free tonight?', time: '10:45 AM', unread: true },
    { id: '2', contact: 'Alice Smith', lastMessage: 'The package has arrived.', time: 'Yesterday', unread: false, avatar: 'https://i.pravatar.cc/150?u=alice' },
    { id: '3', contact: 'Michael Scott', lastMessage: 'That\'s what she said!', time: 'Tuesday', unread: false },
    { id: '4', contact: 'Sarah Connor', lastMessage: 'Come with me if you want to live.', time: 'Monday', unread: false },
];

const MOCK_MESSAGES: Record<string, Message[]> = {
    '1': [
        { id: '1', sender: 'them', text: 'Hey, are you free tonight?', time: '10:45 AM' },
        { id: '2', sender: 'me', text: 'Yeah, what\'s up?', time: '10:46 AM' },
        { id: '3', sender: 'them', text: 'Thinking of hitting that new club.', time: '10:47 AM' },
    ]
};

export default function MessagesApp() {
    const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedConv) scrollToBottom();
    }, [selectedConv]);

    if (selectedConv) {
        const messages = MOCK_MESSAGES[selectedConv.id] || [];

        return (
            <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white pb-6 overflow-hidden">
                {/* Header */}
                <div className="pt-14 pb-4 px-4 flex items-center justify-between glass-vibrant sticky top-0 z-50">
                    <button onClick={() => setSelectedConv(null)} className="flex items-center text-phone-accent pressable">
                        <ChevronLeft size={28} />
                        <span className="text-lg">Messages</span>
                    </button>

                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-ios-gray-4 flex items-center justify-center text-xs font-bold overflow-hidden">
                            {selectedConv.avatar ? <img src={selectedConv.avatar} className="w-full h-full object-cover" /> : <User size={18} className="text-white" />}
                        </div>
                        <span className="text-[11px] font-semibold mt-0.5">{selectedConv.contact}</span>
                    </div>

                    <button className="text-phone-accent pressable">
                        <MoreVertical size={24} />
                    </button>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 flex flex-col no-scrollbar">
                    {messages.map((msg) => {
                        const isMe = msg.sender === 'me';
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, scale: 0.8, x: isMe ? 20 : -20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-[20px] text-ios-body shadow-sm relative ${isMe ? 'bg-ios-blue text-white rounded-tr-[4px]' : 'bg-ios-gray-6 dark:bg-ios-secondary text-black dark:text-white rounded-tl-[4px]'
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </motion.div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Realistic Input Area */}
                <div className="p-4 bg-transparent flex items-center gap-3">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent text-ios-gray-2 pressable">
                        <Plus size={24} />
                    </button>
                    <div className="flex-1 glass dark:bg-[#1c1c1e] rounded-[24px] px-4 py-2 flex items-center gap-2 border-[1px] border-black/5 dark:border-white/5">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="iMessage"
                            className="flex-1 bg-transparent outline-none text-black dark:text-white"
                        />
                        <button className="text-ios-gray-2 pressable">
                            <Mic size={20} />
                        </button>
                    </div>
                    {inputText ? (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-10 h-10 rounded-full bg-ios-blue flex items-center justify-center text-white pressable"
                        >
                            <Send size={20} />
                        </motion.button>
                    ) : (
                        <button className="w-10 h-10 rounded-full flex items-center justify-center text-ios-gray-2 pressable">
                            <Camera size={24} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white overflow-hidden pb-6">
            {/* List Header */}
            <div className="pt-14 pb-4 px-5">
                <div className="flex justify-between items-center mb-6">
                    <button className="text-phone-accent font-medium text-lg">Edit</button>
                    <h1 className="text-lg font-bold">Messages</h1>
                    <button className="text-phone-accent pressable">
                        <Send size={22} className="rotate-0" />
                    </button>
                </div>
                <div className="bg-ios-gray-6 dark:bg-ios-secondary rounded-xl h-10 flex items-center px-3 gap-2">
                    <Plus size={18} className="text-ios-gray rotate-45" />
                    <span className="text-ios-gray font-medium">Search</span>
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
                {MOCK_CONVERSATIONS.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => setSelectedConv(conv)}
                        className="flex items-center gap-4 px-5 py-3 hover:bg-black/5 dark:hover:bg-white/5 active:bg-black/10 transition-colors cursor-pointer select-none group"
                    >
                        <div className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-xl font-bold bg-ios-gray-4 text-white relative overflow-hidden`}>
                            {conv.avatar ? <img src={conv.avatar} className="w-full h-full object-cover" /> : <User size={28} className="text-white" />}
                            {conv.unread && <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-ios-blue rounded-full border-2 border-white dark:border-black" />}
                        </div>

                        <div className="flex-1 border-b-[0.5px] border-black/5 dark:border-white/5 h-full py-2">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className={`font-bold text-lg ${conv.unread ? 'text-black dark:text-white' : 'opacity-90'}`}>
                                    {conv.contact}
                                </span>
                                <div className="flex items-center gap-1.5 opacity-50">
                                    <span className="text-sm">{conv.time}</span>
                                    <ChevronLeft size={16} className="rotate-180" />
                                </div>
                            </div>
                            <p className={`text-ios-body line-clamp-2 ${conv.unread ? 'font-medium text-black dark:text-white' : 'opacity-50'}`}>
                                {conv.lastMessage}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
