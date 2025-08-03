import { Request, Response } from "express";
import { LikeService } from "../services/like.service";

const likeService = new LikeService();

class LikeController {
  // Toggle like on content or comment
  async toggleLike(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { contentId, commentId, type } = req.body;
      // console.log(type);
      // if (!type || (type !== "content" && type !== "comment")) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Type must be 'content' or 'comment'",
      //   });
      // }

      if (type === "content" && !contentId) {
        return res.status(400).json({
          success: false,
          message: "Content ID is required for content likes",
        });
      }

      if (type === "comment" && !commentId) {
        return res.status(400).json({
          success: false,
          message: "Comment ID is required for comment likes",
        });
      }

      const likeData = {
        user: userId,
        content: contentId,
        comment: commentId,
        type,
      };

      const result = await likeService.toggleLike(likeData);
      res.status(200).json({
        success: true,
        data: result,
        message: result.liked ? "Liked successfully" : "Unliked successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error toggling like",
        error: error.message,
      });
    }
  }

  // Check if user has liked content or comment
  async isLikedByUser(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { contentId, commentId, type } = req.query;

      if (!type || (type !== "content" && type !== "comment")) {
        return res.status(400).json({
          success: false,
          message: "Type must be 'content' or 'comment'",
        });
      }

      const isLiked = await likeService.isLikedByUser(
        userId,
        type as "content" | "comment",
        contentId as string,
        commentId as string
      );

      res.status(200).json({
        success: true,
        data: { isLiked },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error checking like status",
        error: error.message,
      });
    }
  }

  // Get like count for content or comment
  async getLikeCount(req: Request, res: Response) {
    try {
      const { contentId, commentId, type } = req.query;

      if (!type || (type !== "content" && type !== "comment")) {
        return res.status(400).json({
          success: false,
          message: "Type must be 'content' or 'comment'",
        });
      }

      const count = await likeService.getLikeCount(
        type as "content" | "comment",
        contentId as string,
        commentId as string
      );

      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error getting like count",
        error: error.message,
      });
    }
  }

  // Get users who liked content or comment
  async getLikedUsers(req: Request, res: Response) {
    try {
      const { contentId, commentId, type } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      if (!type || (type !== "content" && type !== "comment")) {
        return res.status(400).json({
          success: false,
          message: "Type must be 'content' or 'comment'",
        });
      }

      const result = await likeService.getLikedUsers(
        type as "content" | "comment",
        contentId as string,
        commentId as string,
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
        message: "Error fetching liked users",
        error: error.message,
      });
    }
  }

  // Get likes by user
  async getLikesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { type } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await likeService.getLikesByUser(
        userId,
        type as "content" | "comment" | undefined,
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
        message: "Error fetching user likes",
        error: error.message,
      });
    }
  }

  // Remove like
  async removeLike(req: Request, res: Response) {
    try {
      const userId = (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { contentId, commentId, type } = req.body;

      if (!type || (type !== "content" && type !== "comment")) {
        return res.status(400).json({
          success: false,
          message: "Type must be 'content' or 'comment'",
        });
      }

      const removed = await likeService.removeLike(
        userId,
        type,
        contentId,
        commentId
      );

      if (!removed) {
        return res.status(404).json({
          success: false,
          message: "Like not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Like removed successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error removing like",
        error: error.message,
      });
    }
  }
}

export default new LikeController();
