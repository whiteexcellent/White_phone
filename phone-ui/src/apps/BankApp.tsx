import { useState } from 'react';
import { usePhoneStore } from '../store/phoneStore';
import {
    CreditCard,
    ArrowUpRight,
    ArrowDownLeft,
    Repeat,
    Plus,
    ChevronRight,
    TrendingUp,
    Landmark,
    ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_TRANSACTIONS = [
    { id: '1', title: 'Starbucks Coffee', category: 'Food & Drink', amount: -5.45, time: '2h ago', icon: '☕' },
    { id: '2', title: 'Salary Deposit', category: 'Income', amount: 2850.00, time: 'Yesterday', icon: '💰' },
    { id: '3', title: 'Apple Store', category: 'Technology', amount: -199.99, time: '2 days ago', icon: '' },
    { id: '4', title: 'Uber Trip', category: 'Transport', amount: -12.30, time: 'Tuesday', icon: '🚗' },
];

export default function BankApp() {
    const [selectedCard, setSelectedCard] = useState(0);

    return (
        <div className="h-full bg-[#f2f2f7] dark:bg-black text-black dark:text-white flex flex-col overflow-hidden">
            {/* Wallet Header */}
            <div className="pt-14 px-5 pb-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Wallet</h1>
                    <button className="w-8 h-8 rounded-full bg-ios-gray-6 dark:bg-ios-secondary flex items-center justify-center pressable">
                        <Plus size={20} className="text-phone-accent" />
                    </button>
                </div>

                {/* Realistic Card Stack */}
                <div className="relative h-48 w-full group cursor-pointer">
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="absolute inset-0 bg-gradient-to-br from-[#1c1c1e] to-[#2c2c2e] rounded-[18px] p-6 text-white shadow-ios-card z-10 flex flex-col justify-between overflow-hidden"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <Landmark size={20} className="text-ios-gray-3" />
                                <span className="text-sm font-medium tracking-widest uppercase opacity-60">Maze Bank</span>
                            </div>
                            <ShieldCheck size={24} className="text-ios-success" />
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-sm opacity-60">Balance</span>
                            <span className="text-4xl font-bold tracking-tight">$12,450.80</span>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase opacity-40 mb-0.5">Card Holder</span>
                                <span className="text-xs font-medium tracking-widest">JOHN DOE</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] uppercase opacity-40 mb-0.5">Expires</span>
                                <span className="text-xs font-medium tracking-widest">12/28</span>
                            </div>
                        </div>

                        <div className="absolute top-0 right-[-20px] w-48 h-48 bg-white/5 blur-3xl rounded-full" />
                        <div className="absolute bottom-[-40px] left-[-20px] w-32 h-32 bg-ios-blue/10 blur-2xl rounded-full" />
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-4 gap-4 mt-8">
                    <ActionBtn icon={<ArrowUpRight size={22} />} label="Pay" onClick={() => { }} />
                    <ActionBtn icon={<Plus size={22} />} label="Add" onClick={() => { }} />
                    <ActionBtn icon={<TrendingUp size={22} />} label="Savings" onClick={() => { }} />
                    <ActionBtn icon={<Repeat size={22} />} label="Logs" onClick={() => { }} />
                </div>
            </div>

            {/* Latest Transactions */}
            <div className="flex-1 bg-white dark:bg-[#1c1c1e] rounded-t-[32px] mt-2 p-6 overflow-y-auto no-scrollbar shadow-2xl border-t-[0.5px] border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Latest Transactions</h2>
                    <button className="text-phone-accent text-sm font-semibold">See All</button>
                </div>

                <div className="space-y-5">
                    {MOCK_TRANSACTIONS.map((tx) => (
                        <div key={tx.id} className="flex items-center gap-4 pressable">
                            <div className="w-12 h-12 rounded-full bg-[#f2f2f7] dark:bg-ios-secondary flex items-center justify-center text-2xl shadow-sm">
                                {tx.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold">{tx.title}</h3>
                                <span className="text-sm opacity-50">{tx.category}</span>
                            </div>
                            <div className="text-right">
                                <div className={`font-bold ${tx.amount > 0 ? 'text-ios-green' : ''}`}>
                                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                </div>
                                <span className="text-[11px] opacity-40">{tx.time}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Premium Maze Bank Promo Card */}
                <div className="mt-10 bg-ios-blue rounded-2xl p-6 text-white overflow-hidden relative group pressable">
                    <div className="relative z-10 flex flex-col gap-2">
                        <h3 className="text-lg font-bold leading-tight">Investment account for your family</h3>
                        <p className="text-xs opacity-80 max-w-[70%]">Earn up to 4.5% APY on your savings with Maze Bank Premium.</p>
                        <button className="bg-white text-ios-blue w-fit px-4 py-1.5 rounded-full text-xs font-bold mt-2">
                            Learn More
                        </button>
                    </div>
                    <Landmark size={80} className="absolute right-[-20px] bottom-[-10px] text-white/10 rotate-12" />
                </div>
            </div>
        </div>
    );
}

function ActionBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
    return (
        <div className="flex flex-col items-center gap-2 pressable" onClick={onClick}>
            <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1c1c1e] flex items-center justify-center text-ios-blue shadow-ios-soft">
                {icon}
            </div>
            <span className="text-[11px] font-bold opacity-60 uppercase tracking-tighter">{label}</span>
        </div>
    );
}
