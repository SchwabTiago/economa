import express from "express";
import cors from "cors";
import { router as transactionsRouter } from "./routes/transactions.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/v1", transactionsRouter);

app.use(errorHandler);