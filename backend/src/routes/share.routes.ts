import express from "express";
import shareController from "../controllers/share.controller";

const router = express.Router();

// Share routes
router.post("/", shareController.createShare as any);
router.get("/content/:contentId", shareController.getSharesByContent);
router.get("/content/:contentId/count", shareController.getShareCount);
router.get("/user/:userId", shareController.getSharesByUser);
router.get("/platform/:platform", shareController.getSharesByPlatform);
router.get("/content/:contentId/stats", shareController.getShareStatistics);

export default router;
