
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

      const { data: recentData, error: recentError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) return handleTableError(recentError);

      return {
        today: todayTotal,
        month: monthTotal,
        year: yearTotal,
        dailyHistory,
        recentExpenses: recentData as Expense[]
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
  },

  async toggleRegret(id: string, isRegret: boolean) {
    try {
      const { error } = await supabase
        .from('expenses')
        .update({ is_regret: isRegret })
        .eq('id', id);

      if (error) return handleTableError(error);
    } catch (e) {
      throw e;
    }
  },

  async getYearlyStats(userId: string, year: number) {
    try {
      const firstDay = `${year}-01-01`;
      const lastDay = `${year}-12-31`;

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .gte('date', firstDay)
        .lte('date', lastDay);

      if (error) return handleTableError(error);

      let totalSpend = 0;
      let regretTotal = 0;
      const categoryMap: Record<string, number> = {};
      const monthlyMap: Record<number, number> = {};

      data?.forEach(exp => {
        const amt = Number(exp.amount);
        totalSpend += amt;
        if (exp.is_regret) regretTotal += amt;

        categoryMap[exp.category] = (categoryMap[exp.category] || 0) + amt;

        const month = new Date(exp.date).getMonth();
        monthlyMap[month] = (monthlyMap[month] || 0) + amt;
      });

      const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || ['None', 0];
      const peakMonth = Object.entries(monthlyMap).sort((a, b) => b[1] - a[1])[0] || [0, 0];

      return {
        year,
        totalSpend,
        regretTotal,
        topCategory: { name: topCategory[0], amount: topCategory[1] },
        peakMonth: { month: Number(peakMonth[0]), amount: peakMonth[1] },
        transactionCount: data?.length || 0,
        regretCount: data?.filter(e => e.is_regret).length || 0
      };
    } catch (e) {
      throw e;
    }
  }
};
