
import { supabase } from '../supabaseClient';
import { Expense, ExpenseInsert, ExpenseStats, DailyTotal } from '../types';

const handleTableError = (error: any) => {
  if (error.code === 'PGRST116' || (error.message && error.message.includes('relation "expenses" does not exist'))) {
    throw new Error('DATABASE_NOT_SETUP');
  }
  throw error;
};

export const expenseService = {
  async getExpenses(userId: string, month?: string) {
    try {
      let query = supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (month) {
        const startOfMonth = `${month}-01`;
        const nextMonthDate = new Date(startOfMonth);
        nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
        const nextMonth = nextMonthDate.toISOString().split('T')[0];
        query = query.gte('date', startOfMonth).lt('date', nextMonth);
      }

      const { data, error } = await query;
      if (error) return handleTableError(error);
      return data as Expense[];
    } catch (e) {
      throw e;
    }
  },

  async addExpense(expense: ExpenseInsert, userId: string) {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expense, user_id: userId }])
        .select()
        .single();

      if (error) return handleTableError(error);
      return data as Expense;
    } catch (e) {
      throw e;
    }
  },

  async deleteExpense(id: string) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) return handleTableError(error);
    } catch (e) {
      throw e;
    }
  },

  async getDashboardStats(userId: string): Promise<ExpenseStats> {
    try {
      const now = new Date();
      // Use local date string (YYYY-MM-DD) to avoid UTC offset issues
      const todayStr = new Intl.DateTimeFormat('en-CA').format(now);
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const firstDayOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('expenses')
        .select('amount, date')
        .eq('user_id', userId)
        .gte('date', firstDayOfYear);

      if (error) return handleTableError(error);

      let todayTotal = 0;
      let monthTotal = 0;
      let yearTotal = 0;
      const dailyMap = new Map<string, number>();

      data?.forEach(exp => {
        const amt = Number(exp.amount);
        const dateStr = exp.date;

        yearTotal += amt;

        if (dateStr === todayStr) {
          todayTotal += amt;
        }

        if (dateStr >= firstDayOfMonth) {
          monthTotal += amt;
          dailyMap.set(dateStr, (dailyMap.get(dateStr) || 0) + amt);
        }
      });

      const dailyHistory: DailyTotal[] = Array.from(dailyMap.entries())
        .map(([date, amount]) => ({ date, amount }))
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        today: todayTotal,
        month: monthTotal,
        year: yearTotal,
        dailyHistory
      };
    } catch (e) {
      throw e;
    }
  },

  async getCategoryStats(userId: string, month: string) {
    try {
      const startOfMonth = `${month}-01`;
      const nextMonthDate = new Date(startOfMonth);
      nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);
      const nextMonth = nextMonthDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('expenses')
        .select('amount, category')
        .eq('user_id', userId)
        .gte('date', startOfMonth)
        .lt('date', nextMonth);

      if (error) return handleTableError(error);

      const categoryTotals: Record<string, number> = {};
      let grandTotal = 0;

      data?.forEach(exp => {
        const amt = Number(exp.amount);
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + amt;
        grandTotal += amt;
      });

      return Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
        percentage: grandTotal > 0 ? (value / grandTotal) * 100 : 0
      })).sort((a, b) => b.value - a.value);
    } catch (e) {
      throw e;
    }
  }
};
