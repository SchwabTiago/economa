import { Router } from "express";
import { list, create, remove } from "../controllers/transactions.controller.js";

export const router = Router();

router.get("/transactions", list);
router.post("/transactions", create);
router.delete("/transactions/:id", remove);
