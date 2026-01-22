import express from "express";
import { createGroup, getGroupBalances, getGroupDetails, getMyGroups } from "../controllers/groupControllers.js";
import protectedRoute from "../middlewares/protectedroute.js";

const router = express.Router();


//group routes
router.post("/groups", protectedRoute, createGroup);
router.get("/groups", protectedRoute, getMyGroups);
router.get("/groups/:id", protectedRoute, getGroupDetails);
router.get("/group/:groupId", protectedRoute, getGroupBalances);


export default router;