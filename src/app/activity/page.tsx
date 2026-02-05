"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useExpenses } from "@/context/ExpenseContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ActivityPage() {
    const { expenses } = useExpenses();

    return (
        <main className="min-h-screen bg-background text-foreground transition-colors p-4 md:p-8">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between pb-6 border-b">
                    <div className="flex items-center gap-4">
                        <Link href="/">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="h-6 w-6" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Activity Log
                            </h1>
                            <p className="text-muted-foreground text-sm">Recent transactions</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </header>

                {/* Activity List */}
                <section className="space-y-4">
                    {expenses.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>No activity yet.</p>
                            <Link href="/" className="underline text-sm block mt-2">
                                Go back to add an expense
                            </Link>
                        </div>
                    ) : (
                        expenses.map((exp) => (
                            <Card key={exp.id} className="overflow-hidden">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-lg">{exp.reason}</div>
                                        <div className="text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground">{exp.paidBy}</span> paid{" "}
                                            {formatCurrency(exp.amount)} for {exp.splitAmong.length}{" "}
                                            people
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {formatDate(exp.date)}
                                        </div>
                                    </div>
                                    <div className="font-mono text-lg font-bold">
                                        {formatCurrency(exp.amount)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </section>
            </div>
        </main>
    );
}
