
import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { ExpenseStats, DailyTotal } from '../types';
import { 
  AreaChart, 
  Area, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  XAxis
} from 'recharts';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [stats, setStats] = useState<ExpenseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
    fetchData();
  }, [user.id]);

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
          <h1 className="text-3xl font-bold text-white tracking-tight">Daily Spend</h1>
          <p className="text-zinc-500 text-sm mt-1">Track every rupee you spend</p>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="glass-card rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <p className="text-zinc-400 text-sm font-medium mb-2">Total spent today</p>
          <div className="flex items-center gap-6">
            <h2 className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
              ₹{stats.today.toLocaleString()}
            </h2>
            <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-500 text-xs font-bold flex items-center gap-1">
              Active <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 right-10 hidden md:block">
           <p className="text-zinc-500 text-right text-xs font-bold uppercase tracking-widest mb-1">Monthly Total</p>
           <p className="text-white text-2xl font-bold">₹{stats.month.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-[28px] p-6 lg:col-span-2 overflow-hidden">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <h3 className="text-zinc-300 font-semibold">Spending Timeline</h3>
              <p className="text-zinc-500 text-xs mt-1">Daily expenditure this month</p>
            </div>
            <div className="text-right">
               <span className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Avg/Day</span>
               <p className="text-white font-bold">₹{formatCurrency(stats.month / 30)}</p>
            </div>
          </div>
          <div className="h-[280px] w-full" style={{ minWidth: 0 }}>
            {stats.dailyHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dailyHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#f59e0b" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                  />
                  <Tooltip 
                    contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                    itemStyle={{ color: '#f59e0b' }}
                    labelStyle={{ color: '#999', marginBottom: '4px', fontSize: '10px', fontWeight: 'bold' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spent']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-zinc-600 text-sm italic">
                No spending data recorded for this month.
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-[28px] p-6 lg:col-span-1">
          <div className="mb-8">
            <h3 className="text-zinc-300 font-semibold">7-Day Activity</h3>
            <p className="text-zinc-500 text-xs mt-1">How much you spend every day</p>
          </div>
          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-white">₹{formatCurrency(activityData.reduce((acc, curr) => acc + curr.amount, 0))}</span>
            <span className="text-zinc-500 text-xs font-bold">WEEK TOTAL</span>
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
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
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
        <div className="glass-card rounded-[28px] p-8 flex items-center justify-between">
           <div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Yearly Spending</p>
              <h3 className="text-white font-bold text-3xl">₹{stats.year.toLocaleString()}</h3>
           </div>
           <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" /></svg>
           </div>
        </div>
        <div className="glass-card rounded-[28px] p-8 flex items-center justify-between">
           <div>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Most Expensive Day</p>
              <h3 className="text-white font-bold text-3xl">
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
