
import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { Expense } from '../types';

interface RegretReviewPageProps {
    user: any;
}

const RegretReviewPage: React.FC<RegretReviewPageProps> = ({ user }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const data = await expenseService.getExpenses(user.id, filterMonth);
            setExpenses(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [user.id, filterMonth]);

    const handleToggleRegret = async (id: string, currentStatus: boolean) => {
        try {
            await expenseService.toggleRegret(id, !currentStatus);
            setExpenses(expenses.map(exp => exp.id === id ? { ...exp, is_regret: !currentStatus } : exp));
        } catch (error) {
            alert('Error updating regret status.');
        }
    };

    const regrettedExpenses = expenses.filter(exp => exp.is_regret);
    const totalWasted = regrettedExpenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    // Calculate category breakdown for regretted items
    const categoryBreakdown = regrettedExpenses.reduce((acc: Record<string, number>, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
        return acc;
    }, {});

    const sortedCategories = Object.entries(categoryBreakdown).sort((a, b) => Number(b[1]) - Number(a[1]));

    const getClarityInsight = () => {
        const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);
        const regretRatio = totalSpent > 0 ? (totalWasted / totalSpent) * 100 : 0;

        if (regretRatio === 0) return "Perfect! Every rupee spent brought you value this month.";
        if (regretRatio < 5) return "Great job! Your impulse purchases are well under control.";
        if (regretRatio < 15) return "Not bad, but there's room for more intentional spending.";
        return "Time to reflect. A significant portion of your spending feels like a waste.";
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-title)] tracking-tight">Regret Review</h1>
                    <p className="text-[var(--text-muted)] text-sm mt-1">“Which purchases weren’t worth it?”</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <input
                        type="month"
                        className="w-full md:w-auto bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-title)] focus:outline-none focus:ring-1 focus:ring-accent transition-all font-bold"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    />
                </div>
            </header>

            {/* Regret Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-[32px] p-8 md:p-10 relative overflow-hidden group shadow-[var(--shadow)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative z-10">
                        <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-2">Total "Wasted" Money</p>
                        <h2 className="text-5xl md:text-6xl font-bold text-[var(--text-title)] tracking-tighter mb-6">
                            ₹{totalWasted.toLocaleString()}
                        </h2>
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                                <span className="text-xl">💡</span>
                            </div>
                            <div>
                                <h4 className="text-[var(--text-title)] font-bold text-sm">Clarity Insight</h4>
                                <p className="text-[var(--text-body)] text-xs mt-1 leading-relaxed">{getClarityInsight()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card rounded-[32px] p-8 shadow-[var(--shadow)]">
                    <h3 className="text-[var(--text-title)] font-bold text-lg mb-6">Where it went wrong</h3>
                    <div className="space-y-4">
                        {sortedCategories.length > 0 ? (
                            sortedCategories.map(([category, amount]) => (
                                <div key={category} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-zinc-400">
                                            {category.charAt(0)}
                                        </div>
                                        <span className="text-zinc-300 text-sm font-medium">{category}</span>
                                    </div>
                                    <span className="text-rose-400 font-bold text-sm">₹{amount.toLocaleString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-zinc-600 text-sm italic py-10 text-center">No regretted items yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="glass-card rounded-[32px] overflow-hidden shadow-[var(--shadow)]">
                <div className="p-6 md:p-8 border-b border-white/5">
                    <h3 className="text-[var(--text-title)] font-bold">Monthly Transactions</h3>
                    <p className="text-[var(--text-muted)] text-xs mt-1">Review your spending and mark items you regret</p>
                </div>

                <div className="divide-y divide-white/5">
                    {loading ? (
                        <div className="p-20 text-center text-[var(--text-muted)]">Loading transactions...</div>
                    ) : expenses.length > 0 ? (
                        expenses.map((expense) => (
                            <div key={expense.id} className="p-6 md:px-8 hover:bg-white/[0.01] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner transition-all duration-500 ${expense.is_regret ? 'bg-rose-500/20 text-rose-500' : 'bg-[var(--input-bg)] text-[var(--text-muted)] shadow-sm'}`}>
                                        {expense.category.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-[var(--text-title)] font-bold text-sm">{expense.category}</h4>
                                        <p className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-widest leading-none mt-1">
                                            {new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} • ₹{expense.amount.toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <p className="text-[var(--text-muted)] text-xs italic truncate max-w-[200px] md:max-w-xs">{expense.note || 'No description'}</p>

                                    <button
                                        onClick={() => handleToggleRegret(expense.id, expense.is_regret)}
                                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${expense.is_regret
                                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                                            : 'bg-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-base">{expense.is_regret ? '💔' : '❤️'}</span>
                                        {expense.is_regret ? 'Regretted' : 'Worth it'}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-20 text-center text-zinc-600 italic">No transactions found for this month.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegretReviewPage;
