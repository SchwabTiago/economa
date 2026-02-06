import { z } from "zod";

const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;

export const createTransactionSchema = z.object({
  description: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(60),
  amountCents: z.number().int().positive(),
  paidAt: z.string().regex(dateOnlyRegex, "Expected YYYY-MM-DD"),
  type: z.enum(["expense", "income"]),
});

export const listTransactionsQuerySchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(1970).max(2100),
});
