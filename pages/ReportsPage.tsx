
import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

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

    const handleDownloadCSV = async () => {
        try {
            const expenses = await expenseService.getExpenses(user.id, filterMonth);
            if (expenses.length === 0) {
                alert('No transactions found for this month.');
                return;
            }

            // CSV Headers
            const headers = ['Date', 'Category', 'Amount (INR)', 'Note'];
            const csvRows = [headers.join(',')];

            // CSV Data Rows
            expenses.forEach(exp => {
                const row = [
                    exp.date,
                    `"${exp.category}"`,
                    exp.amount,
                    `"${exp.note || ''}"`
                ];
                csvRows.push(row.join(','));
            });

            const csvContent = csvRows.join('\n');
            const monthName = new Date(`${filterMonth}-01`).toLocaleString('default', { month: 'long', year: 'numeric' });
            const fileName = `Spend_Tracker_Statement_${monthName.replace(' ', '_')}.csv`;

            // Check if we are on a native platform (Android)
            if (Capacitor.isNativePlatform()) {
                // For Mobile: Save and Share
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: csvContent,
                    directory: Directory.Cache, // Use Cache for temporary sharing
                    encoding: Encoding.UTF8,
                });

                await Share.share({
                    title: 'Export My Statement',
                    text: `Financial report for ${monthName}`,
                    url: result.uri,
                    dialogTitle: 'Share Statement',
                });
            } else {
                // For Web Browser: Standard Download
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                link.setAttribute('download', fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (error) {
            alert('Failed to generate statement.');
            console.error('Download error:', error);
        }
    };

    useEffect(() => {
        fetchStats();
    }, [user.id, filterMonth]);

    // ... rest of the component
    const totalSpent = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 md:pb-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-title)] tracking-tight">Monthly Report</h1>
                    <p className="text-[var(--text-muted)] text-xs md:text-sm mt-1">Breakdown of your spending by category</p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <input
                            type="month"
                            className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-title)] focus:outline-none focus:ring-1 focus:ring-accent transition-all font-bold"
                            value={filterMonth}
                            onChange={(e) => setFilterMonth(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleDownloadCSV}
                        className="px-6 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] hover:bg-white/10 text-[var(--text-title)] font-bold rounded-xl transition-all flex items-center justify-center gap-2 group"
                    >
                        <svg className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        Download Statement
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {/* Chart Card */}
                <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 min-h-[400px] md:min-h-[450px] flex flex-col items-center justify-center shadow-[var(--shadow)]">
                    {loading ? (
                        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
                    ) : data.length > 0 ? (
                        <>
                            <div className="h-[280px] md:h-[350px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={5}
                                            dataKey="value"
                                            animationDuration={1500}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{
                                                background: 'var(--card-bg)',
                                                border: '1px solid var(--card-border)',
                                                borderRadius: '12px',
                                                padding: '12px',
                                                color: 'var(--text-title)'
                                            }}
                                            itemStyle={{ color: 'var(--text-title)', fontSize: '10px', fontWeight: 'bold' }}
                                            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Total Spent']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                    <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest leading-tight">Total</p>
                                    <h2 className="text-base md:text-xl font-bold text-[var(--text-title)] leading-tight">₹{totalSpent > 1000 ? (totalSpent / 1000).toFixed(1) + 'K' : totalSpent}</h2>
                                </div>
                            </div>
                            <div className="mt-8 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {data.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase truncate">{entry.name}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-zinc-500 italic">No data for this month</div>
                    )}
                </div>

                {/* Categories List Card */}
                <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 shadow-[var(--shadow)]">
                    <h3 className="text-white font-bold text-lg mb-6 md:mb-8">Category Breakdown</h3>
                    <div className="space-y-5 md:space-y-6">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-12 w-full bg-white/5 rounded-2xl animate-pulse"></div>
                            ))
                        ) : data.length > 0 ? (
                            data.map((entry, index) => (
                                <div key={index} className="group">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[var(--text-title)] font-bold text-sm tracking-wide truncate">{entry.name}</p>
                                                <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase">{entry.percentage.toFixed(1)}% of total</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-[var(--text-title)] font-bold text-sm md:text-base">₹{entry.value.toLocaleString()}</p>
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
                            <div className="h-full flex items-center justify-center text-zinc-600 italic py-10">No transactions recorded.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
