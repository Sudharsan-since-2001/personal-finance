
export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  note: string | null;
  date: string;
  created_at: string;
}

export type ExpenseInsert = Omit<Expense, 'id' | 'created_at' | 'user_id'>;

export enum Category {
  RENT = 'Rent',
  EMI = 'EMI',
  LOAN = 'Loan',
  TRANSPORT = 'Transport',
  GROCERIES = 'Groceries',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  CINEMA = 'Cinema',
  FOOD_DELIVERY = 'Swiggy / Zomato',
  BEEF = 'Beef',
  CHICKEN = 'Chicken',
  FISH = 'Fish',
  PHARMACY = 'Pharmacy',
  RECHARGE = 'Recharge',
  OTHER = 'Other'
}

export interface DailyTotal {
  date: string;
  amount: number;
}

export interface ExpenseStats {
  today: number;
  month: number;
  year: number;
  dailyHistory: DailyTotal[];
}
