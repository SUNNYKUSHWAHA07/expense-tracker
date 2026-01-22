import express from "express";

import { getAllExpenses, createExpense, removeExpense,splitExpenses, getExpenseById} from "../controllers/expenseController.js";
import { deleteExpense, getGroupExpenses, updateExpense } from "../controllers/groupControllers.js";
import protectedRoute from "../middlewares/protectedroute.js";
const router = express.Router();



// Sample route for expenses
router.get("/", getAllExpenses);
router.post("/", createExpense);
router.delete("/:id", removeExpense);
router.get("/split", splitExpenses);

//exprense routes
router.get("/expenses/group/:groupId", protectedRoute, getGroupExpenses);
router.put("/expenses/:id", protectedRoute, updateExpense);
router.get("/expenses/:id", protectedRoute, getExpenseById);
router.delete("/expenses/:id", protectedRoute, deleteExpense);


export default router;
