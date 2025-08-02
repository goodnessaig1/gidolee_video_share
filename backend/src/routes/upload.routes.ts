import express from "express";
import upload from "../middleware/upload";
import uploadController from "../controllers/upload.controller";
const router = express.Router();

router.post(
  "/",
  upload.single("file"),

  uploadController.uploadFile as any
);

export default router;
