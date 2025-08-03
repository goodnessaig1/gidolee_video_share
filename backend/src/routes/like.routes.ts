import express from "express";
import likeController from "../controllers/like.controller";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

// Like routes
router.post("/toggle", isLoggedIn, likeController.toggleLike as any);
router.get("/check", likeController.isLikedByUser as any);
router.get("/count", likeController.getLikeCount as any);
router.get("/users", likeController.getLikedUsers as any);
router.get("/user/:userId", likeController.getLikesByUser as any);
router.delete("/", likeController.removeLike as any);

export default router;
