import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Balance, Expense, Settlement, User, USERS } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// 2. Core Logic: Calculate Net Balances
export function calculateBalances(expenses: Expense[]): Balance[] {
    const balanceMap: Record<string, number> = {};

    // Initialize everyone with 0
    USERS.forEach((u) => (balanceMap[u] = 0));

    expenses.forEach((expense) => {
        const { paidBy, amount, splitAmong } = expense;

        // The payer gets +Amount (they are "owed" this back effectively for now)
        balanceMap[paidBy] += amount;

        // The cost is split equally among the participants
        // Assumption: splitAmong is the list of beneficiaries.
        // Usually, if I pay 100 for A and B, and I am A.
        // splitAmong = [A, B].
        // I pay 100. I get +100.
        // I consume 50. I lose 50. Net +50.
        // B consumes 50. B loses 50. Net -50.
        const splitAmount = amount / splitAmong.length;

        // Each participant "owes" their share (subtract from their balance)
        splitAmong.forEach((person) => {
            balanceMap[person] -= splitAmount;
        });
    });

    // Convert map to array and round to 2 decimals to avoid floating point errors
    return Object.entries(balanceMap).map(([user, amount]) => ({
        user: user as User,
        netAmount: parseFloat(amount.toFixed(2)),
    }));
}

// 3. Algorithm: Minimize Cash Flow (Settle Now)
// This reduces the web of debts to the fewest possible transactions
export function calculateSettlements(balances: Balance[]): Settlement[] {
    // Deep copy to avoid mutating the original state during calculation
    let currentBalances = balances.map((b) => ({ ...b }));
    const settlements: Settlement[] = [];

    // Filter out people who are settled (approx 0)
    // We use a small epsilon (0.01) because floating point math isn't perfect
    let debtors = currentBalances.filter((b) => b.netAmount < -0.01);
    let creditors = currentBalances.filter((b) => b.netAmount > 0.01);

    // Sort by magnitude (optional, but helps greedy approach find big matches)
    debtors.sort((a, b) => a.netAmount - b.netAmount); // Most negative first
    creditors.sort((a, b) => b.netAmount - a.netAmount); // Most positive first

    let i = 0; // Iterator for debtors
    let j = 0; // Iterator for creditors

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of what the debtor owes vs what creditor is owed
        const amount = Math.min(Math.abs(debtor.netAmount), creditor.netAmount);

        // Record the settlement
        if (amount > 0) {
            settlements.push({
                from: debtor.user,
                to: creditor.user,
                amount: parseFloat(amount.toFixed(2)),
            });
        }

        // Update internal balances
        debtor.netAmount += amount;
        creditor.netAmount -= amount;

        // If debtor is settled (close to 0), move to next debtor
        if (Math.abs(debtor.netAmount) < 0.01) {
            i++;
        }

        // If creditor is settled (close to 0), move to next creditor
        if (Math.abs(creditor.netAmount) < 0.01) {
            j++;
        }
    }

    return settlements;
}

// 4. Formatting Helper
export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(amount);
};

// 5. Date Helper
export const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(timestamp));
};
