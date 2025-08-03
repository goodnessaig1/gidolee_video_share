import { Request, Response } from "express";
import { CommentService } from "../services/comment.service";

const commentService = new CommentService();

class CommentController {
  // Create new comment
  async createComment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const commentData = {
        ...req.body,
        user: userId,
      };

      const comment = await commentService.createComment(commentData);
      res.status(201).json({
        success: true,
        data: comment,
        message: "Comment created successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error creating comment",
        error: error.message,
      });
    }
  }

  // Get comments for content
  async getCommentsByContent(req: Request, res: Response) {
    try {
      const { contentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await commentService.getCommentsByContent(
        contentId,
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
        message: "Error fetching comments",
        error: error.message,
      });
    }
  }

  // Get comment by ID
  async getCommentById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const comment = await commentService.getCommentById(id);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching comment",
        error: error.message,
      });
    }
  }

  // Get replies for comment
  async getRepliesByComment(req: Request, res: Response) {
    try {
      const { commentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await commentService.getRepliesByComment(
        commentId,
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
        message: "Error fetching replies",
        error: error.message,
      });
    }
  }

  // Update comment
  async updateComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const comment = await commentService.updateComment(id, userId, req.body);
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found or unauthorized",
        });
      }

      res.status(200).json({
        success: true,
        data: comment,
        message: "Comment updated successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error updating comment",
        error: error.message,
      });
    }
  }

  // Delete comment
  async deleteComment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const deleted = await commentService.deleteComment(id, userId);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: "Comment not found or unauthorized",
        });
      }

      res.status(200).json({
        success: true,
        message: "Comment deleted successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error deleting comment",
        error: error.message,
      });
    }
  }

  // Get comments by user
  async getCommentsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await commentService.getCommentsByUser(
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
        message: "Error fetching user comments",
        error: error.message,
      });
    }
  }
}

export default new CommentController();
