import { Request, Response } from "express";
import { GenreService } from "../services/genre.service";

const genreService = new GenreService();

class GenreController {
  // Create a new genre
  async createGenre(req: Request, res: Response): Promise<void> {
    try {
      const genreData = req.body;

      const genre = await genreService.createGenre(genreData);
      res.status(201).json({
        success: true,
        data: genre,
        message: "Genre created successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error creating genre",
        error: error.message,
      });
    }
  }

  // Get all genres
  async getAllGenres(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const activeOnly = req.query.activeOnly !== "false";

      const result = await genreService.getAllGenres(page, limit, activeOnly);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching genres",
        error: error.message,
      });
    }
  }

  // Get genre by ID
  async getGenreById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const genre = await genreService.getGenreById(id);
      if (!genre) {
        res.status(404).json({
          success: false,
          message: "Genre not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: genre,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching genre",
        error: error.message,
      });
    }
  }

  // Get genre by slug
  async getGenreBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const genre = await genreService.getGenreBySlug(slug);
      if (!genre) {
        res.status(404).json({
          success: false,
          message: "Genre not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: genre,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching genre",
        error: error.message,
      });
    }
  }

  // Update genre
  async updateGenre(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const genre = await genreService.updateGenre(id, updateData);
      if (!genre) {
        res.status(404).json({
          success: false,
          message: "Genre not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: genre,
        message: "Genre updated successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error updating genre",
        error: error.message,
      });
    }
  }

  // Delete genre (soft delete)
  async deleteGenre(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await genreService.deleteGenre(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Genre not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Genre deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error deleting genre",
        error: error.message,
      });
    }
  }

  // Hard delete genre
  async hardDeleteGenre(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const deleted = await genreService.hardDeleteGenre(id);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "Genre not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Genre permanently deleted",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error deleting genre",
        error: error.message,
      });
    }
  }

  // Search genres
  async searchGenres(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!q) {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const result = await genreService.searchGenres(q as string, page, limit);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error searching genres",
        error: error.message,
      });
    }
  }

  // Get popular genres
  async getPopularGenres(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;

      const genres = await genreService.getPopularGenres(limit);
      res.status(200).json({
        success: true,
        data: genres,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching popular genres",
        error: error.message,
      });
    }
  }

  // Get active genres (for dropdowns)
  async getActiveGenres(req: Request, res: Response): Promise<void> {
    try {
      const genres = await genreService.getActiveGenres();
      res.status(200).json({
        success: true,
        data: genres,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching active genres",
        error: error.message,
      });
    }
  }
}

export default new GenreController();
