
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

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await expenseService.deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      alert('Error deleting transaction.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await expenseService.addExpense({
        amount: parseFloat(amount),
        category,
        date,
        note: note.trim() || null,
        is_regret: false
      }, user.id);
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
          <h1 className="text-3xl font-bold text-[var(--text-title)] tracking-tight">Payments</h1>
          <p className="text-[var(--text-muted)] text-sm mt-1">History of all transactions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="month"
              className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-sm text-[var(--text-title)] focus:outline-none focus:ring-1 focus:ring-accent transition-all font-bold"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Add Entry
          </button>
        </div>
      </header>

      {showForm && (
        <div className="glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 animate-in zoom-in-95 duration-300 shadow-[var(--shadow)]">
          <h2 className="text-xl font-bold text-[var(--text-title)] mb-6">Log New Transaction</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount (₹)</label>
              <input
                type="number" step="0.01" required placeholder="0.00"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-[var(--text-title)] focus:outline-none focus:border-accent"
                value={amount} onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
              <select
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-[var(--text-title)] focus:outline-none focus:border-accent appearance-none"
                value={category} onChange={(e) => setCategory(e.target.value as Category)}
              >
                {Object.values(Category).map((cat) => <option key={cat} value={cat} className="bg-[var(--background)] text-[var(--foreground)]">{cat}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</label>
              <input
                type="date" required
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-[var(--text-title)] focus:outline-none focus:border-accent"
                value={date} onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Notes</label>
              <input
                type="text" placeholder="Description"
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-3 text-[var(--text-title)] focus:outline-none focus:border-accent"
                value={note} onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-zinc-500 font-bold hover:text-zinc-300 transition-colors order-2 sm:order-1">Discard</button>
              <button type="submit" disabled={submitting} className="px-10 py-3 bg-white text-zinc-950 font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-xl order-1 sm:order-2">
                {submitting ? 'Saving...' : 'Confirm Entry'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card rounded-[24px] md:rounded-[32px] overflow-hidden shadow-[var(--shadow)]">
        <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-[var(--text-title)] font-bold text-lg">Expense details</h2>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden divide-y divide-white/5">
          {loading ? (
            <div className="p-8 text-center text-zinc-600">Syncing database...</div>
          ) : expenses.length > 0 ? (
            expenses.map((expense) => (
              <div key={expense.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs uppercase shadow-inner">
                      {expense.category.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-zinc-100 font-bold text-sm tracking-tight">{expense.category}</h4>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">#{expense.id.slice(0, 4).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--text-title)] font-bold text-lg">₹{Number(expense.amount).toFixed(2)}</p>
                    <p className="text-zinc-500 text-[10px]">{new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                  </div>
                </div>
                <p className="text-[var(--text-body)] text-sm italic bg-white/5 p-3 rounded-lg">{expense.note || 'No description'}</p>
                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <span className="inline-flex px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-amber-500/20">
                      LOGGED
                    </span>
                    {expense.is_regret && (
                      <span className="inline-flex px-3 py-1 bg-rose-500/10 text-rose-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-rose-500/20">
                        REGRET 💔
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-[var(--text-muted)] hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-20 text-center text-zinc-600">No payment data found.</div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-8 py-6">Reference</th>
                <th className="px-8 py-6">Category</th>
                <th className="px-8 py-6">Note</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-zinc-600">Syncing database...</td></tr>
              ) : expenses.length > 0 ? (
                expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs uppercase shadow-inner group-hover:from-amber-600 group-hover:to-amber-700 transition-all">
                          {expense.category.charAt(0)}
                        </div>
                        <span className="text-[var(--text-title)] font-medium text-sm">#{expense.id.slice(0, 4).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-zinc-400 font-medium">{expense.category}</td>
                    <td className="px-8 py-5 text-sm text-zinc-500 italic max-w-xs truncate">{expense.note || 'No description'}</td>
                    <td className="px-8 py-5 text-sm font-bold text-[var(--text-title)]">₹{Number(expense.amount).toFixed(2)}</td>
                    <td className="px-8 py-5 text-sm text-zinc-500">{new Date(expense.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {expense.is_regret && <span className="text-sm" title="Regretted purchase">💔</span>}
                        <span className="inline-flex px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider rounded-lg border border-amber-500/20">
                          LOGGED
                        </span>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-zinc-600 hover:text-rose-500 transition-all"
                          title="Delete Transaction"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
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
