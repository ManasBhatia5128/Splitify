import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, USERS, Balance } from "@/lib/types"; // Import Balance from types


interface DashboardProps {
    balances: Balance[];
}

export function Dashboard({ balances }: DashboardProps) {
    // We want to show all users, even if they have 0 balance
    const fullBalances = USERS.map((user) => {
        const existing = balances.find((b) => b.user === user);
        return existing || { user, netAmount: 0 };
    });

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fullBalances.map((balance) => {
                const isPositive = balance.netAmount > 0;
                const isNegative = balance.netAmount < 0;

                return (
                    <Card key={balance.user} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {balance.user}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`text-2xl font-bold ${isPositive
                                    ? "text-green-600 dark:text-green-400"
                                    : isNegative
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-muted-foreground"
                                    }`}
                            >
                                {balance.netAmount > 0 ? "+" : ""}
                                {formatCurrency(balance.netAmount)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {isPositive
                                    ? "is owed details"
                                    : isNegative
                                        ? "owes details"
                                        : "Settled up"}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
