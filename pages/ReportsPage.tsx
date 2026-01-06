
import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ReportsPageProps {
    user: any;
}

const COLORS = ['#f59e0b', '#7c3aed', '#ec4899', '#06b6d4', '#10b981', '#f43f5e', '#a855f7', '#64748b'];

const ReportsPage: React.FC<ReportsPageProps> = ({ user }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

    const fetchStats = async () => {
        setLoading(true);
        try {
            const stats = await expenseService.getCategoryStats(user.id, filterMonth);
            setData(stats);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [user.id, filterMonth]);

    const totalSpent = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Monthly Report</h1>
                    <p className="text-zinc-500 text-sm mt-1">Breakdown of your spending by category</p>
                </div>
                <div className="relative">
                    <input
                        type="month"
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all font-bold"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chart Card */}
                <div className="glass-card rounded-[32px] p-8 min-h-[450px] flex flex-col items-center justify-center">
                    {loading ? (
                        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                    ) : data.length > 0 ? (
                        <>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                            animationDuration={1500}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Spent']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-center mt-[-190px] pointer-events-none">
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Spent</p>
                                <h2 className="text-3xl font-bold text-white">₹{totalSpent.toLocaleString()}</h2>
                            </div>
                            <div className="mt-[130px] w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                                {data.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2 px-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-[10px] font-bold text-zinc-400 uppercase truncate">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-zinc-500 italic">No data for this month</div>
                    )}
                </div>

                {/* Categories List Card */}
                <div className="glass-card rounded-[32px] p-8">
                    <h3 className="text-white font-bold text-lg mb-8">Category Breakdown</h3>
                    <div className="space-y-6">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-12 w-full bg-white/5 rounded-2xl animate-pulse"></div>
                            ))
                        ) : data.length > 0 ? (
                            data.map((entry, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform duration-300">
                                                {/* Small dot indicator */}
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm tracking-wide">{entry.name}</p>
                                                <p className="text-zinc-500 text-[10px] font-bold uppercase">{entry.percentage.toFixed(1)}% of total</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white font-bold">₹{entry.value.toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${entry.percentage}%`,
                                                backgroundColor: COLORS[index % COLORS.length],
                                                boxShadow: `0 0 10px ${COLORS[index % COLORS.length]}40`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-600 italic">No transactions recorded.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
