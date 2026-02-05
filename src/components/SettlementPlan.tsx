import { ArrowRight } from "lucide-react";
import { Settlement } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettlementPlanProps {
    settlements: Settlement[];
    title?: string;
}

export function SettlementPlan({
    settlements,
    title = "Settlement Plan",
}: SettlementPlanProps) {
    if (settlements.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-center text-muted-foreground">
                        No debts to settle. You are all square!
                    </CardTitle>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
                {settlements.map((s, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-4"
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-red-600 dark:text-red-400">
                                {s.from}
                            </span>
                            <span className="text-muted-foreground text-sm">pays</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                                {s.to}
                            </span>
                        </div>
                        <div className="font-bold">{formatCurrency(s.amount)}</div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
