import { Request, Response } from "express";
import { ContentService } from "../services/content.service";
import { GenreService } from "../services/genre.service";
import uploadService from "../services/upload.service";

const contentService = new ContentService();
const genreService = new GenreService();
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

class ContentController {
  async createContent(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { genre } = req.body;
      if (!genre) {
        return res.status(400).json({
          success: false,
          message: "Genre is required",
        });
      }

      const genreExists = await genreService.genreExists(genre);
      if (!genreExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid genre",
        });
      }
      if (!req?.file) {
        return res.status(401).json({ message: "No file uploaded" });
      }
      let mediaUrl: string | undefined;

      const { buffer, originalname, mimetype } = req?.file;
      const result = await uploadService.uploadFile(
        buffer,
        originalname,
        mimetype
      );
      mediaUrl = result.url;

      const contentData = {
        ...req.body,
        mediaUrl,
        user: userId,
      };

      const content = await contentService.createContent(contentData);
      res.status(201).json({
        success: true,
        data: content,
        message: "Content created successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error creating content",
        error: error.message,
      });
    }
  }

  // Debug contents
  async debugContents(req: Request, res: Response) {
    try {
      const contents = await contentService.debugContents();
      res.status(200).json({
        success: true,
        data: contents,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error debugging contents",
        error: error.message,
      });
    }
  }

  // Get all contents with pagination
  async getAllContents(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const genreId = req.query.genre as string;
      const userId = (req as any).user?._id;

      const result = await contentService.getAllContents(
        page,
        limit,
        userId,
        genreId
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching contents",
        error: error.message,
      });
    }
  }

  // Get content by ID
  async getContentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;

      const content = await contentService.getContentById(id, userId);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: "Content not found",
        });
      }

      // Increment view count
      await contentService.incrementViews(id);

      res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching content",
        error: error.message,
      });
    }
  }

  // Get contents by user
  async getContentsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await contentService.getContentsByUser(
        userId,
        page,
        limit
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching user contents",
        error: error.message,
      });
    }
  }

  // Get contents by genre
  async getContentsByGenre(req: Request, res: Response) {
    try {
      const { genreId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const userId = (req as any).user?._id;

      // Validate genre exists
      const genreExists = await genreService.genreExists(genreId);
      if (!genreExists) {
        return res.status(404).json({
          success: false,
          message: "Genre not found",
        });
      }

      const result = await contentService.getContentsByGenre(
        genreId,
        page,
        limit,
        userId
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching genre contents",
        error: error.message,
      });
    }
  }

  // Update content
  async updateContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { genre } = req.body;

      // Validate genre if provided
      if (genre) {
        const genreExists = await genreService.genreExists(genre);
        if (!genreExists) {
          return res.status(400).json({
            success: false,
            message: "Invalid genre",
          });
        }
      }

      const content = await contentService.updateContent(id, userId, req.body);
      if (!content) {
        return res.status(404).json({
          success: false,
          message: "Content not found or unauthorized",
        });
      }

      res.status(200).json({
        success: true,
        data: content,
        message: "Content updated successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error updating content",
        error: error.message,
      });
    }
  }

  // Delete content
  async deleteContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const deleted = await contentService.deleteContent(id, userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Content not found or unauthorized",
        });
      }

      res.status(200).json({
        success: true,
        message: "Content deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error deleting content",
        error: error.message,
      });
    }
  }

  // Search contents
  async searchContents(req: Request, res: Response) {
    try {
      const { q, genre } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: "Search query is required",
        });
      }

      // Validate genre if provided
      if (genre) {
        const genreExists = await genreService.genreExists(genre as string);
        if (!genreExists) {
          return res.status(400).json({
            success: false,
            message: "Invalid genre",
          });
        }
      }

      const result = await contentService.searchContents(
        q as string,
        page,
        limit,
        genre as string
      );
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error searching contents",
        error: error.message,
      });
    }
  }
}

export default new ContentController();
