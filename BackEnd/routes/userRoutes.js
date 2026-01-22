import express from "express";
import { getAllUsers } from "../controllers/userControllers.js";
const router = express.Router();

//userRoutes
router.get("/", getAllUsers)


export default router;