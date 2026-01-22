import express from "express";
import { createUser , getMe, loginUser} from "../controllers/authContollers.js";
import protectedRoute from "../middlewares/protectedroute.js";
const router = express.Router();


//auth routes
router.post("/register", createUser)
router.post("/login", loginUser)
router.get("/me", protectedRoute, getMe);


export default router;