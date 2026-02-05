"use client";

import * as React from "react";
import { Expense, Balance, Settlement, User, USERS } from "@/lib/types";
import { calculateBalances, calculateSettlements } from "@/lib/utils";

interface ExpenseContextType {
    expenses: Expense[];
    addExpense: (expenseData: Omit<Expense, "id" | "date">) => Promise<void>;
    clearExpenses: () => Promise<void>;
    balances: Balance[];
    settlements: Settlement[];
    isLoading: boolean;
}

const ExpenseContext = React.createContext<ExpenseContextType | undefined>(
    undefined
);

const STORAGE_KEY = "spliftify_expenses";

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
    const [expenses, setExpenses] = React.useState<Expense[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    // Load from API
    React.useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await fetch("/api/expenses");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setExpenses(data);
            } catch (e) {
                console.error("Failed to load expenses", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchExpenses();
    }, []);

    const addExpense = async (expenseData: Omit<Expense, "id" | "date">) => {
        try {
            const res = await fetch("/api/expenses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(expenseData),
            });
            if (!res.ok) throw new Error("Failed to add expense");
            const newExpense = await res.json();
            setExpenses((prev) => [newExpense, ...prev]);
        } catch (e) {
            console.error("Failed to add expense", e);
        }
    };

    const clearExpenses = async () => {
        try {
            const res = await fetch("/api/expenses", { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to clear");
            setExpenses([]);
        } catch (e) {
            console.error("Failed to clear expenses", e);
        }
    };

    const balances = React.useMemo(() => calculateBalances(expenses), [expenses]);
    const settlements = React.useMemo(
        () => calculateSettlements(balances),
        [balances]
    );

    return (
        <ExpenseContext.Provider
            value={{
                expenses,
                addExpense,
                clearExpenses,
                balances,
                settlements,
                isLoading,
            }}
        >
            {children}
        </ExpenseContext.Provider>
    );
}

export function useExpenses() {
    const context = React.useContext(ExpenseContext);
    if (context === undefined) {
        throw new Error("useExpenses must be used within an ExpenseProvider");
    }
    return context;
}
