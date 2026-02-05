"use client";

import * as React from "react";
import { User, USERS } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface AddExpenseFormProps {
    onAddExpense: (expense: {
        paidBy: User;
        amount: number;
        splitAmong: User[];
        reason: string;
    }) => void;
}

const REASONS = [
    "Food",
    "Transport",
    "Rent",
    "Utilities",
    "Entertainment",
    "Other",
];

export function AddExpenseForm({ onAddExpense }: AddExpenseFormProps) {
    const [paidBy, setPaidBy] = React.useState<User>(USERS[0]);
    const [amount, setAmount] = React.useState("");
    const [splitAmong, setSplitAmong] = React.useState<User[]>([...USERS]);
    const [reasonType, setReasonType] = React.useState(REASONS[0]);
    const [customReason, setCustomReason] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }
        if (splitAmong.length === 0) {
            toast.error("Please select at least one person to split with");
            return;
        }

        onAddExpense({
            paidBy,
            amount: Number(amount),
            splitAmong,
            reason: reasonType === "Other" ? customReason || "General" : reasonType,
        });

        toast.success("Expense added successfully!");

        // Reset form
        setAmount("");
        setCustomReason("");
        setSplitAmong([...USERS]);
    };

    const toggleUser = (user: User) => {
        setSplitAmong((prev) =>
            prev.includes(user) ? prev.filter((u) => u !== user) : [...prev, user]
        );
    };

    return (
        <Card className="shadow-lg border-muted/20">
            <CardHeader>
                <CardTitle>Add Expense</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">
                                Paid By
                            </label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={paidBy}
                                onChange={(e) => setPaidBy(e.target.value as User)}
                            >
                                {USERS.map((u) => (
                                    <option key={u} value={u}>
                                        {u}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground/80">
                                Amount
                            </label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0"
                                step="0.01"
                                className="font-mono text-lg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/80">
                            For What?
                        </label>
                        <div className="flex gap-2">
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={reasonType}
                                onChange={(e) => setReasonType(e.target.value)}
                            >
                                {REASONS.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                            {reasonType === "Other" && (
                                <Input
                                    placeholder="Specify..."
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground/80 block">
                            Split Among
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {USERS.map((user) => {
                                const isSelected = splitAmong.includes(user);
                                return (
                                    <button
                                        key={user}
                                        type="button"
                                        onClick={() => toggleUser(user)}
                                        className={cn(
                                            "group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border transition-all duration-200",
                                            isSelected
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                                : "bg-background text-muted-foreground border-input hover:border-indigo-600/50 hover:bg-slate-50 dark:hover:bg-slate-900"
                                        )}
                                    >
                                        {isSelected && (
                                            <Check className="h-4 w-4 animate-in zoom-in spin-in-180 duration-200" />
                                        )}
                                        {user}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-muted-foreground ml-1">
                            {splitAmong.length === USERS.length
                                ? "Everyone involved"
                                : `${splitAmong.length} people involved`}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white"
                    >
                        Add Transaction
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
