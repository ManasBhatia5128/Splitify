export const USERS = ["Karamveer", "Vishal", "Aviral", "Utkarsh", "Manas"] as const;
export type User = typeof USERS[number];

export interface Expense {
  id: string;
  paidBy: User;
  amount: number;
  splitAmong: User[]; // List of users involved in the split (including payer if applicable)
  reason: string;
  date: number;
}

export interface Balance {
  user: User;
  netAmount: number; // Positive = Owed to them (Green), Negative = They owe (Red)
}

export interface Settlement {
  from: User;
  to: User;
  amount: number;
}
