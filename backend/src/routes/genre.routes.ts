import express from "express";
import genreController from "../controllers/genre.controller";
import { isLoggedIn } from "../middleware/isLoggedIn";
import { roleAuthorization } from "../middleware/roleAuthorization";

const router = express.Router();

// Public routes
router.get("/", genreController.getAllGenres);
router.get("/active", genreController.getActiveGenres);
router.get("/popular", genreController.getPopularGenres);
router.get("/search", genreController.searchGenres);
router.get("/:id", genreController.getGenreById);
router.get("/slug/:slug", genreController.getGenreBySlug);

// Protected routes (admin only)
router.post(
  "/",
  isLoggedIn,
  roleAuthorization(["admin"]),
  genreController.createGenre
);
router.put(
  "/:id",
  isLoggedIn,
  roleAuthorization(["admin"]),
  genreController.updateGenre
);
router.delete(
  "/:id",
  isLoggedIn,
  roleAuthorization(["admin"]),
  genreController.deleteGenre
);
router.delete(
  "/:id/hard",
  isLoggedIn,
  roleAuthorization(["admin"]),
  genreController.hardDeleteGenre
);

export default router;
