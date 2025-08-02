import { Request, Response } from "express";
import { ShareService } from "../services/share.service";

const shareService = new ShareService();

class ShareController {
  // Create new share
  async createShare(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const shareData = {
        ...req.body,
        user: userId,
      };

      const share = await shareService.createShare(shareData);
      res.status(201).json({
        success: true,
        data: share,
        message: "Content shared successfully",
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error sharing content",
        error: error.message,
      });
    }
  }

  // Get shares for content
  async getSharesByContent(req: Request, res: Response) {
    try {
      const { contentId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await shareService.getSharesByContent(
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
        message: "Error fetching shares",
        error: error.message,
      });
    }
  }

  // Get share count for content
  async getShareCount(req: Request, res: Response) {
    try {
      const { contentId } = req.params;

      const count = await shareService.getShareCount(contentId);
      res.status(200).json({
        success: true,
        data: { count },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error getting share count",
        error: error.message,
      });
    }
  }

  // Get shares by user
  async getSharesByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await shareService.getSharesByUser(userId, page, limit);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching user shares",
        error: error.message,
      });
    }
  }

  // Get shares by platform
  async getSharesByPlatform(req: Request, res: Response) {
    try {
      const { platform } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await shareService.getSharesByPlatform(
        platform,
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
        message: "Error fetching platform shares",
        error: error.message,
      });
    }
  }

  // Get share statistics
  async getShareStatistics(req: Request, res: Response) {
    try {
      const { contentId } = req.params;

      const stats = await shareService.getShareStatistics(contentId);
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Error fetching share statistics",
        error: error.message,
      });
    }
  }
}

export default new ShareController();
