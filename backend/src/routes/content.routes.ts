import express from "express";
import contentController from "../controllers/content.controller";
import upload from "../middleware/upload";
import { isLoggedIn } from "../middleware/isLoggedIn";

const router = express.Router();

// Content routes
router.post(
  "/",
  upload.single("mediaUrl"),
  isLoggedIn,
  contentController.createContent as any
);
router.get("/debug", contentController.debugContents as any);
router.get("/", contentController.getAllContents);
router.get("/search", contentController.searchContents as any);
router.get("/genre/:genreId", contentController.getContentsByGenre as any);
router.get("/:id", contentController.getContentById as any);
router.get("/user/:userId", contentController.getContentsByUser as any);
router.put("/:id", contentController.updateContent as any);
router.delete("/:id", contentController.deleteContent as any);

export default router;
