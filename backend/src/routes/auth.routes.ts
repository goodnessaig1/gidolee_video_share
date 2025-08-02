import express from "express";
import authController from "../controllers/auth.controller";
import upload from "../middleware/upload";
const router = express.Router();

router.post(
  "/register",
  upload.single("profilePicture"),

  authController.register
);
router.post("/login", authController.login);
router.get("/", authController.getAllUsers);
router.get("/:id", authController.getUserById);
router.patch(
  "/:id",
  upload.single("profilePicture"),
  authController.updateUser
);
router.delete("/:id", authController.deleteUser);

export default router;
