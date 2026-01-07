
import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { useNavigate } from 'react-router-dom';

interface YearlyWrappedPageProps {
    user: any;
}

const YearlyWrappedPage: React.FC<YearlyWrappedPageProps> = ({ user }) => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await expenseService.getYearlyStats(user.id, currentYear);
                setStats(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh]">
                <div className="w-12 h-12 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-zinc-500 font-bold uppercase tracking-widest text-xs">Preparing your story...</p>
            </div>
        );
    }

    if (!stats || stats.transactionCount === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6 bg-nav-bg text-white rounded-[40px] m-4 border border-border">
                <span className="text-6xl mb-6">🏜️</span>
                <h2 className="text-2xl font-bold mb-2">Not enough data yet</h2>
                <p className="text-zinc-500 max-w-xs mb-8">Start logging your expenses to see your {currentYear} story later!</p>
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-accent text-white font-bold rounded-xl">Back to Payments</button>
            </div>
        );
    }

    const slides = [
        {
            title: "Hey there!",
            body: `Ready to see how you spent your ${currentYear}?`,
            bgColor: "bg-gradient-to-br from-amber-500 to-orange-600",
            content: (
                <div className="text-center animate-bounce-slow">
                    <span className="text-8xl">✨</span>
                </div>
            )
        },
        {
            title: "The Big Number",
            body: "You moved quite a bit of money this year.",
            bgColor: "bg-gradient-to-tr from-purple-600 to-indigo-700",
            content: (
                <div className="text-center space-y-4">
                    <p className="text-sm uppercase font-bold tracking-[0.3em] opacity-80">Total Spent</p>
                    <h2 className="text-6xl md:text-7xl font-bold tracking-tighter animate-in zoom-in duration-1000">₹{stats.totalSpend.toLocaleString()}</h2>
                    <p className="text-lg opacity-90 animate-in slide-in-from-bottom-5 duration-1000 delay-500">{stats.transactionCount} habits recorded.</p>
                </div>
            )
        },
        {
            title: "Category Champion",
            body: `Your wallet had a favorite place to be.`,
            bgColor: "bg-gradient-to-bl from-emerald-500 to-teal-700",
            content: (
                <div className="text-center space-y-6">
                    <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center text-4xl shadow-2xl animate-spin-slow">
                        🏆
                    </div>
                    <div>
                        <h2 className="text-5xl font-bold tracking-tight">{stats.topCategory.name}</h2>
                        <p className="text-xl mt-2 opacity-80">₹{stats.topCategory.amount.toLocaleString()}</p>
                    </div>
                </div>
            )
        },
        {
            title: "The Peak",
            body: "One month really pushed the limits.",
            bgColor: "bg-gradient-to-br from-rose-500 to-pink-600",
            content: (
                <div className="text-center space-y-4">
                    <p className="text-7xl">📈</p>
                    <h2 className="text-5xl font-bold">{new Date(0, stats.peakMonth.month).toLocaleString('default', { month: 'long' })}</h2>
                    <p className="text-xl opacity-80">Your most expensive month.</p>
                </div>
            )
        },
        {
            title: "Emotional Audit",
            body: "Not every purchase brought a smile.",
            bgColor: "bg-gradient-to-tr from-zinc-700 to-slate-900",
            content: (
                <div className="text-center space-y-6">
                    <div className="flex justify-center gap-4">
                        <span className="text-6xl animate-pulse">💔</span>
                    </div>
                    <div>
                        <h2 className="text-5xl font-bold">₹{stats.regretTotal.toLocaleString()}</h2>
                        <p className="text-lg opacity-80 mt-2">Spent on purchases you regretted.</p>
                        <p className="text-sm mt-4 italic opacity-60">({stats.regretCount} items marked as 💔)</p>
                    </div>
                </div>
            )
        },
        {
            title: "Year Summary",
            body: "Keep being mindful in the next one.",
            bgColor: "bg-[#0f0f0f]",
            content: (
                <div className="w-full max-w-sm bg-[#1a1a1a] rounded-3xl p-8 space-y-8 border border-white/10 shadow-2xl text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-2xl shadow-lg shadow-accent/20">✨</div>
                        <div>
                            <h3 className="font-bold text-white uppercase tracking-widest text-xs">My {currentYear} Story</h3>
                            <p className="text-zinc-500 text-[10px] font-bold">GENERATED BY SPEND TRACKER</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-zinc-400 text-xs lowercase opacity-70">Total Spend</span>
                            <span className="text-white font-bold">₹{stats.totalSpend.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-zinc-400 text-xs lowercase opacity-70">Top Category</span>
                            <span className="text-white font-bold">{stats.topCategory.name}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                            <span className="text-zinc-400 text-xs lowercase opacity-70">Total Regret</span>
                            <span className="text-rose-400 font-bold">₹{stats.regretTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-zinc-200 transition-all text-sm uppercase tracking-widest mt-4 shadow-xl"
                    >
                        Back to Tracker
                    </button>
                </div>
            )
        }
    ];

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    const slide = slides[currentSlide];

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center text-white transition-all duration-1000 ${slide.bgColor}`}>
            {/* Exit Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-10 right-6 z-[110] p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-md transition-all"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* Progress Bars */}
            <div className="absolute top-8 left-6 right-16 flex gap-1.5 z-[110]">
                {slides.map((_, i) => (
                    <div key={i} className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className={`h-full bg-white transition-all duration-500 ${i < currentSlide ? 'w-full' : i === currentSlide ? 'animate-progress' : 'w-0'}`}
                        ></div>
                    </div>
                ))}
            </div>

            <div className="p-8 md:p-20 flex flex-col items-center justify-center h-full w-full max-w-2xl relative">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <h1 className="text-sm font-bold uppercase tracking-[0.4em] opacity-80 mb-4">{slide.title}</h1>
                    <p className="text-2xl md:text-3xl font-bold tracking-tight">{slide.body}</p>
                </div>

                <div className="flex-1 flex items-center justify-center w-full animate-in fade-in zoom-in duration-1000 delay-300">
                    {slide.content}
                </div>
            </div>

            {/* Tap Zones */}
            <div className="absolute inset-0 flex">
                <div className="flex-1 h-full cursor-w-resize" onClick={prevSlide}></div>
                <div className="flex-1 h-full cursor-e-resize" onClick={nextSlide}></div>
            </div>
        </div>
    );
};

export default YearlyWrappedPage;
