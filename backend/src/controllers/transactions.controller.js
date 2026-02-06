import {
  createTransactionSchema,
  listTransactionsQuerySchema,
} from "../schemas/transactions.schemas.js";

import {
  listTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactions.service.js";

export async function list(req, res, next) {
  try {
    const query = listTransactionsQuerySchema.parse(req.query);
    const result = await listTransactions(query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const body = createTransactionSchema.parse(req.body);
    const created = await createTransaction(body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await deleteTransaction(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
