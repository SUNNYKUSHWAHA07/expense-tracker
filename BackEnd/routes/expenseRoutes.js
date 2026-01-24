import express from "express";

import { getAllExpenses, createExpense, removeExpense,splitExpenses, getExpenseById} from "../controllers/expenseController.js";
import { deleteExpense, getGroupExpenses, updateExpense } from "../controllers/groupControllers.js";
import protectedRoute from "../middlewares/protectedroute.js";
const router = express.Router();



;

//exprense routes
router.get("/", protectedRoute, getAllExpenses);
router.post("/", protectedRoute, createExpense);
router.delete("/:id", protectedRoute, removeExpense);
router.get("/split", protectedRoute, splitExpenses)
router.get("/expenses/group/:groupId", protectedRoute, getGroupExpenses);
router.put("/expenses/:id", protectedRoute, updateExpense);
router.get("/expenses/:id", protectedRoute, getExpenseById);
router.delete("/expenses/:id", protectedRoute, deleteExpense);


export default router;
