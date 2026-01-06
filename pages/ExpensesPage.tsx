
import React, { useState, useEffect } from 'react';
import { expenseService } from '../services/expenseService';
import { Expense, Category, ExpenseInsert } from '../types';

interface ExpensesPageProps {
  user: any;
}

const ExpensesPage: React.FC<ExpensesPageProps> = ({ user }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [showForm, setShowForm] = useState(false);

  const [amount, setAmount] = useState('');
  // Fix: Use Category.GROCERIES as Category.FOOD does not exist in types.ts
  const [category, setCategory] = useState(Category.GROCERIES);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => { fetchExpenses(); }, [user.id, filterMonth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await expenseService.addExpense({ amount: parseFloat(amount), category, date, note: note.trim() || null }, user.id);
      // Fix: Use Category.GROCERIES as Category.FOOD does not exist in types.ts
      setAmount(''); setCategory(Category.GROCERIES); setDate(new Date().toISOString().split('T')[0]); setNote(''); setShowForm(false);
      fetchExpenses();
    } catch (error) {
      alert('Error saving expense.');
    } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Payments</h1>
          <p className="text-zinc-500 text-sm mt-1">History of all transactions</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
             <input 
                type="month" 
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
             />
           </div>
           <button
             onClick={() => setShowForm(!showForm)}
             className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
             Add Entry
           </button>
        </div>
      </header>

      {showForm && (
        <div className="glass-card rounded-[32px] p-8 animate-in zoom-in-95 duration-300">
          <h2 className="text-xl font-bold text-white mb-6">Log New Transaction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount (₹)</label>
              <input
                type="number" step="0.01" required placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                value={amount} onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 appearance-none"
                value={category} onChange={(e) => setCategory(e.target.value as Category)}
              >
                {Object.values(Category).map((cat) => <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</label>
              <input
                type="date" required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                value={date} onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Notes</label>
              <input
                type="text" placeholder="Description"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                value={note} onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="lg:col-span-4 flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-zinc-500 font-bold hover:text-zinc-300 transition-colors">Discard</button>
                <button type="submit" disabled={submitting} className="px-10 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-xl">
                  {submitting ? 'Saving...' : 'Confirm Entry'}
                </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card rounded-[32px] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Expense details</h2>
            <button className="text-zinc-500 text-xs font-bold hover:text-white flex items-center gap-2">
                Show all <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-6">Reference</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Note</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-zinc-600">Syncing database...</td></tr>
              ) : expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-8 py-5">
                       <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs uppercase shadow-inner">
                           {expense.category.charAt(0)}
                         </div>
                         <span className="text-zinc-100 font-medium text-sm">#{expense.id.slice(0, 4).toUpperCase()}</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-zinc-400 font-medium">{expense.category}</td>
                    <td className="px-8 py-5 text-sm text-zinc-500 italic max-w-xs truncate">{expense.note || 'No description'}</td>
                    <td className="px-8 py-5 text-sm font-bold text-white">₹{Number(expense.amount).toFixed(2)}</td>
                    <td className="px-8 py-5 text-sm text-zinc-500">{new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                    <td className="px-8 py-5 text-right">
                       <span className="inline-flex px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-amber-500/20">
                          LOGGED
                       </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-zinc-600">No payment data found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
