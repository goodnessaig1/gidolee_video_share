import express from "express";
import userController from "../controllers/user.controller";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

router.get("/userProfile", isLoggedIn, userController.getSignedInUser as any);

export default router;
