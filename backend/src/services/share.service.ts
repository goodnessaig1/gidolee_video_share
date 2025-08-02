import { Share, IShare } from "../models/share.model";
import { Content } from "../models/content.model";
import mongoose from "mongoose";

export interface CreateShareData {
  user: string;
  content: string;
  platform?: string;
  shareUrl?: string;
}

export class ShareService {
  // Create new share
  async createShare(data: CreateShareData): Promise<IShare> {
    const share = new Share(data);
    const savedShare = await share.save();

    // Increment share count on content
    await Content.findByIdAndUpdate(data.content, { $inc: { shares: 1 } });

    return savedShare;
  }

  // Get shares for content
  async getSharesByContent(
    contentId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const shares = await Share.find({ content: contentId })
      .populate("user", "fullname profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Share.countDocuments({ content: contentId });

    return {
      shares,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get share count for content
  async getShareCount(contentId: string): Promise<number> {
    const count = await Share.countDocuments({ content: contentId });
    return count;
  }

  // Get shares by user
  async getSharesByUser(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const shares = await Share.find({ user: userId })
      .populate("content", "title mediaUrl thumbnail")
      .populate("user", "fullname profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Share.countDocuments({ user: userId });

    return {
      shares,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get shares by platform
  async getSharesByPlatform(
    platform: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const shares = await Share.find({ platform })
      .populate("content", "title mediaUrl thumbnail")
      .populate("user", "fullname profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Share.countDocuments({ platform });

    return {
      shares,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get share statistics
  async getShareStatistics(contentId: string) {
    const stats = await Share.aggregate([
      { $match: { content: new mongoose.Types.ObjectId(contentId) } },
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    return stats;
  }
}
