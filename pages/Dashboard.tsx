
import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { ExpenseStats, DailyTotal } from '../types';
import {
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchData = async () => {
    try {
      const dashboardStats = await expenseService.getDashboardStats(user.id);
      setStats(dashboardStats);
      setDbError(false);
    } catch (error: any) {
      if (error.message === 'DATABASE_NOT_SETUP') {
        setDbError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, [user.id]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    try {
      await expenseService.deleteExpense(id);
      fetchData();
    } catch (error) {
      alert('Error deleting transaction.');
    }
  };

  if (loading || !mounted) return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
    </div>
  );

  if (dbError || !stats) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
      <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Setup Required</h2>
      <p className="text-zinc-500 max-sm mb-8">Please complete the SQL setup steps to enable your dashboard tracking.</p>
    </div>
  );

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `${(val / 1000).toFixed(0)}K`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
    return val.toFixed(0);
  };

  const getLast7DaysData = () => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = new Intl.DateTimeFormat('en-CA').format(d);
      const found = stats.dailyHistory.find(h => h.date === dateStr);
      data.push({
        name: d.toLocaleDateString(undefined, { weekday: 'short' }),
        amount: found ? found.amount : 0,
        fullDate: dateStr
      });
    }
    return data;
  };

  const activityData = getLast7DaysData();

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-title)] tracking-tight">Daily Spend</h1>
          <p className="text-[var(--text-muted)] text-xs md:text-sm mt-1">Track every rupee you spend</p>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-12 relative overflow-hidden group shadow-[var(--shadow)]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <p className="text-[var(--text-body)] text-xs md:text-sm font-medium mb-2">Total spent today</p>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
            <h2 className="text-5xl md:text-7xl font-bold text-[var(--text-title)] tracking-tighter">
              ₹{stats.today.toLocaleString()}
            </h2>
            <div className="w-fit px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-500 text-[10px] md:text-xs font-bold flex items-center gap-1">
              Active <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="mt-8 md:mt-0 md:absolute md:bottom-10 md:right-10">
          <p className="text-[var(--text-muted)] text-left md:text-right text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1">Monthly Total</p>
          <p className="text-[var(--text-title)] text-xl md:text-2xl font-bold">₹{stats.month.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-[28px] p-6 md:col-span-2 lg:col-span-2 overflow-hidden shadow-[var(--shadow)]">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-[var(--text-title)] font-semibold text-lg">Recent Transactions</h3>
              <p className="text-[var(--text-muted)] text-xs mt-1">Your latest expenditure entries</p>
            </div>
            <a href="#/expenses" className="text-amber-500 text-xs font-bold hover:underline">View History</a>
          </div>

          <div className="space-y-3">
            {stats.recentExpenses && stats.recentExpenses.length > 0 ? (
              stats.recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 md:p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all group">
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="text-[var(--text-title)] font-medium text-sm">{expense.category}</h4>
                      <p className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-widest">{new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[var(--text-title)] font-bold">₹{expense.amount.toLocaleString()}</p>
                      <p className="text-[var(--text-muted)] text-[10px] italic truncate max-w-[80px] md:max-w-[150px]">{expense.note || 'No note'}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="p-2 text-zinc-700 hover:text-rose-500 transition-colors md:opacity-0 md:group-hover:opacity-100"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-zinc-600 text-sm italic">No recent transactions found.</p>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-[28px] p-6 lg:col-span-1 shadow-[var(--shadow)]">
          <div className="mb-8">
            <h3 className="text-[var(--text-title)] font-semibold">7-Day Activity</h3>
            <p className="text-[var(--text-muted)] text-xs mt-1">How much you spend every day</p>
          </div>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[var(--text-title)]">₹{formatCurrency(activityData.reduce((acc, curr) => acc + curr.amount, 0))}</span>
            <span className="text-[var(--text-muted)] text-xs font-bold">WEEK TOTAL</span>
          </div>
          <div className="h-[240px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <Bar dataKey="amount" radius={[4, 4, 4, 4]}>
                  {activityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.amount > 0 ? '#f59e0b' : '#27272a'}
                      fillOpacity={entry.amount > 0 ? 1 : 0.5}
                    />
                  ))}
                </Bar>
                <Tooltip
                  cursor={{ fill: 'rgba(var(--foreground), 0.05)' }}
                  contentStyle={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    color: 'var(--text-title)'
                  }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between px-2 mt-4">
            {activityData.map((d, i) => (
              <span key={i} className="text-[10px] font-bold text-zinc-600 uppercase">{d.name[0]}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        <div className="glass-card rounded-[28px] p-8 flex items-center justify-between shadow-[var(--shadow)]">
          <div>
            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-2">Yearly Spending</p>
            <h3 className="text-[var(--text-title)] font-bold text-3xl">₹{stats.year.toLocaleString()}</h3>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--text-muted)]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
          </div>
        </div>
        <div className="glass-card rounded-[28px] p-8 flex items-center justify-between shadow-[var(--shadow)]">
          <div>
            <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest mb-2">Most Expensive Day</p>
            <h3 className="text-[var(--text-title)] font-bold text-3xl">
              ₹{stats.dailyHistory.length > 0
                ? Math.max(...stats.dailyHistory.map(h => h.amount)).toLocaleString()
                : '0'}
            </h3>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
