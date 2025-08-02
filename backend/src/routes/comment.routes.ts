import express from "express";
import commentController from "../controllers/comment.controller";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

// Comment routes
router.post("/", isLoggedIn, commentController.createComment as any);
router.get(
  "/content/:contentId",
  commentController.getCommentsByContent as any
);
router.get("/:id", commentController.getCommentById as any);
router.get("/:commentId/replies", commentController.getRepliesByComment as any);
router.get("/user/:userId", commentController.getCommentsByUser as any);
router.put("/:id", commentController.updateComment as any);
router.delete("/:id", commentController.deleteComment as any);

export default router;
