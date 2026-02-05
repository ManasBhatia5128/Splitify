"use client";

import * as React from "react";
import { User, USERS } from "@/lib/types";
import { useExpenses } from "@/context/ExpenseContext";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

export function UserBalanceBreakdown() {
    const { settlements, balances } = useExpenses();
    const [selectedUser, setSelectedUser] = React.useState<User>(USERS[0]);

    const userBalance = balances.find((b) => b.user === selectedUser)?.netAmount || 0;

    // Filter settlements where the selected user is involved
    const userSettlements = settlements.filter(
        (s) => s.from === selectedUser || s.to === selectedUser
    );

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0.5 pb-4">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-bold">User Breakdown</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Detailed peer-to-peer status
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value as User)}
                        className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {USERS.map((user) => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))}
                    </select>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <span className="font-medium">Total Net Balance</span>
                    <span
                        className={`text-xl font-bold ${userBalance > 0
                            ? "text-green-600 dark:text-green-400"
                            : userBalance < 0
                                ? "text-red-600 dark:text-red-400"
                                : "text-muted-foreground"
                            }`}
                    >
                        {userBalance > 0 ? "+" : ""}
                        {formatCurrency(userBalance)}
                    </span>
                </div>

                <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                        Settlements for {selectedUser}
                    </h3>
                    {userSettlements.length === 0 ? (
                        <p className="text-sm text-center py-4 text-muted-foreground">
                            All settled up with everyone!
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {userSettlements.map((s, idx) => {
                                const isDebtor = s.from === selectedUser;
                                const otherUser = isDebtor ? s.to : s.from;

                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`p-2 rounded-full ${isDebtor
                                                    ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                                                    : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                                                    }`}
                                            >
                                                <ArrowRightLeft className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {isDebtor ? (
                                                        <>
                                                            Owes <span className="font-bold">{otherUser}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            Is owed by <span className="font-bold">{otherUser}</span>
                                                        </>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={`font-mono font-bold ${isDebtor ? "text-red-600" : "text-green-600"
                                                }`}
                                        >
                                            {formatCurrency(s.amount)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
