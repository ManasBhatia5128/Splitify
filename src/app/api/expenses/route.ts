import { NextResponse } from "next/server";
import { docClient, TABLE_NAME } from "@/lib/dynamodb";
import { ScanCommand, PutCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { Expense } from "@/lib/types";

export async function GET() {
    try {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
        });
        const response = await docClient.send(command);
        // Sort by date descending
        const items = (response.Items as Expense[]) || [];
        items.sort((a, b) => b.date - a.date);
        return NextResponse.json(items);
    } catch (error) {
        console.error("DynamoDB GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const expenseData = await request.json();
        const newExpense: Expense = {
            id: Date.now().toString(),
            ...expenseData,
            date: Date.now(),
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newExpense,
        });

        await docClient.send(command);
        return NextResponse.json(newExpense);
    } catch (error) {
        console.error("DynamoDB POST Error:", error);
        return NextResponse.json({ error: "Failed to add expense" }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        // For a simple "clear all", we'd need to fetch all and delete each,
        // or recreate the table. Since it's a transactions table, 
        // usually we don't clear all. But for this app, we'll implement it.
        const scanCommand = new ScanCommand({ TableName: TABLE_NAME });
        const { Items } = await docClient.send(scanCommand);

        if (Items && Items.length > 0) {
            const deletePromises = Items.map((item) =>
                docClient.send(
                    new DeleteCommand({
                        TableName: TABLE_NAME,
                        Key: { id: item.id },
                    })
                )
            );
            await Promise.all(deletePromises);
        }

        return NextResponse.json({ message: "All expenses cleared" });
    } catch (error) {
        console.error("DynamoDB DELETE Error:", error);
        return NextResponse.json({ error: "Failed to clear expenses" }, { status: 500 });
    }
}
