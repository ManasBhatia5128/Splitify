"use client";

import * as React from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Dashboard } from "@/components/Dashboard";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { SettlementPlan } from "@/components/SettlementPlan";
import { UserBalanceBreakdown } from "@/components/UserBalanceBreakdown";
import { useExpenses } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Home() {
  const { balances, addExpense, settlements, clearExpenses } = useExpenses();
  const [showSettlement, setShowSettlement] = React.useState(false);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header - High Visibility */}
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Spliftify
            </h1>
            <p className="text-muted-foreground">Local-only expense splitting</p>
          </div>
          <ThemeToggle />
        </header>

        {/* Dashboard Cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Balances</h2>
            <button
              onClick={() => {
                if (confirm("Clear all data?")) {
                  clearExpenses();
                  toast.success("All data has been reset.");
                }
              }}
              className="text-xs text-red-600 dark:text-red-400 font-medium hover:underline"
            >
              Reset All
            </button>
          </div>
          <Dashboard balances={balances} />
        </section>

        {/* User Specific Breakdown */}
        <section>
          <UserBalanceBreakdown />
        </section>

        {/* Actions Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Add Expense */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Add Expense</h2>
            <AddExpenseForm onAddExpense={addExpense} />
          </section>

          {/* Settle Up Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Settlement</h2>
              {/* Settle Now Button - High Contrast */}
              <Button
                onClick={() => setShowSettlement(!showSettlement)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:text-white"
              >
                {showSettlement ? "Hide Plan" : "Settle Now"}
              </Button>
            </div>

            {showSettlement && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <SettlementPlan settlements={settlements} />
              </div>
            )}

            {!showSettlement && settlements.length > 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p>Debts are pending.</p>
                <p className="text-sm">Click "Settle Now" to see the optimized payment plan.</p>
              </div>
            )}

            {!showSettlement && settlements.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <p>All settled up!</p>
              </div>
            )}
          </section>
        </div>

        {/* Activity Navigation Button */}
        <section className="flex justify-center pt-4">
          <Link href="/activity">
            <Button size="lg" className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-gray-200">
              View Activity Log
            </Button>
          </Link>
        </section>
      </div>
    </main>
  );
}
