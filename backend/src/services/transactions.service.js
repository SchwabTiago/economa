import { prisma } from "../db/prisma.js";
import { HttpError } from "../errors/httpError.js";

function monthRangeUTC(year, month) {
  const from = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const to = new Date(Date.UTC(year, month, 1, 0, 0, 0));
  return { from, to };
}

function dateOnlyToUTCDate(dateOnly) {
  const [y, m, d] = dateOnly.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
}

function toDateOnlyUTC(dateObj) {
  return dateObj.toISOString().slice(0, 10);
}

export async function listTransactions({ month, year }) {
  const { from, to } = monthRangeUTC(year, month);

  const rows = await prisma.transaction.findMany({
    where: { paidAt: { gte: from, lt: to } },
    orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
  });

  const items = rows.map((t) => ({
    id: t.id,
    description: t.description,
    category: t.category,
    amountCents: t.amountCents,
    paidAt: toDateOnlyUTC(t.paidAt),
    type: t.type,
  }));

  const totalCents = items.reduce(
    (acc, t) => acc + (t.type === "income" ? t.amountCents : -t.amountCents),
    0
  );

  return { items, summary: { month, year, totalCents } };
}

export async function createTransaction(payload) {
  const created = await prisma.transaction.create({
    data: {
      description: payload.description,
      category: payload.category,
      amountCents: payload.amountCents,
      paidAt: dateOnlyToUTCDate(payload.paidAt),
      type: payload.type,
    },
  });

  return {
    id: created.id,
    description: created.description,
    category: created.category,
    amountCents: created.amountCents,
    paidAt: toDateOnlyUTC(created.paidAt),
    type: created.type,
  };
}

export async function deleteTransaction(id) {
  const exists = await prisma.transaction.findUnique({ where: { id } });
  if (!exists) throw new HttpError(404, "Transaction not found");

  await prisma.transaction.delete({ where: { id } });
}
