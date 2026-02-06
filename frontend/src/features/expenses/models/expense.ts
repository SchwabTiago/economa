export type TransactionType = "expense" | "income";

export type Expense = {
  id: string;
  description: string;
  category: string;
  amountCents: number;
  paidAt: string;
  type: TransactionType;
};
