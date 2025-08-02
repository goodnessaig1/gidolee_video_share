import { Content, IContent } from "../models/content.model";
import { Comment } from "../models/comment.model";
import { Like } from "../models/like.model";
import { Share } from "../models/share.model";
import mongoose from "mongoose";

export interface CreateContentData {
  user: string;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaType: "video" | "image";
  thumbnail?: string;
  duration?: number;
  isPublic?: boolean;
  tags?: string[];
  location?: string;
  genre: string; // Genre ID
}

export interface UpdateContentData {
  title?: string;
  description?: string;
  thumbnail?: string;
  isPublic?: boolean;
  tags?: string[];
  location?: string;
  genre?: string; // Genre ID
}

export class ContentService {
  // Create new content
  async createContent(data: CreateContentData): Promise<IContent> {
    const content = new Content(data);
    return await content.save();
  }

  // Debug method to check contents
  async debugContents() {
    const contents = await Content.find({}).lean();
    console.log("Total contents:", contents.length);

    if (contents.length > 0) {
      console.log("Sample content:", contents[0]);

      // Check if contents have required fields
      const hasPublic = contents.some((c) => c.isPublic !== undefined);
      const hasGenre = contents.some((c) => c.genre !== undefined);
      const hasUser = contents.some((c) => c.user !== undefined);

      console.log("Has isPublic field:", hasPublic);
      console.log("Has genre field:", hasGenre);
      console.log("Has user field:", hasUser);

      // Count public contents
      const publicContents = contents.filter((c) => c.isPublic === true);
      console.log("Public contents:", publicContents.length);
    }

    return contents;
  }

  // Get all contents with aggregated data
  async getAllContents(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    genreId?: string
  ) {
    const skip = (page - 1) * limit;

    // Don't filter by isPublic since existing content doesn't have this field
    const matchStage: any = {};
    if (
      genreId &&
      genreId.trim() !== "" &&
      mongoose.Types.ObjectId.isValid(genreId)
    ) {
      matchStage.genre = new mongoose.Types.ObjectId(genreId);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genre",
        },
      },
      { $unwind: { path: "$genre", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "content",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "content",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "shares",
          localField: "_id",
          foreignField: "content",
          as: "shares",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
          shareCount: { $size: "$shares" },
          isLiked: {
            $cond: {
              if: {
                $and: [
                  { $ne: [userId, null] },
                  { $ne: [userId, ""] },
                  { $in: [new mongoose.Types.ObjectId(userId), "$likes.user"] },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: { $ifNull: ["$description", ""] },
          mediaUrl: 1,
          mediaType: { $ifNull: ["$mediaType", "video"] },
          thumbnail: { $ifNull: ["$thumbnail", null] },
          duration: { $ifNull: ["$duration", null] },
          views: { $ifNull: ["$views", 0] },
          likes: { $ifNull: ["$likes", 0] },
          shares: { $ifNull: ["$shares", 0] },
          isPublic: { $ifNull: ["$isPublic", true] },
          tags: { $ifNull: ["$tags", []] },
          location: { $ifNull: ["$location", null] },
          createdAt: 1,
          updatedAt: 1,
          commentCount: 1,
          likeCount: 1,
          shareCount: 1,
          isLiked: 1,
          user: {
            _id: "$user._id",
            fullName: "$user.fullName",
            profilePicture: "$user.profilePicture",
          },
          genre: {
            _id: "$genre._id",
            name: "$genre.name",
            slug: "$genre.slug",
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const contents = await Content.aggregate(pipeline as any[]);
    const total = await Content.countDocuments(matchStage);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get content by ID with all related data
  async getContentById(contentId: string, userId?: string) {
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(contentId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genre",
        },
      },
      { $unwind: { path: "$genre", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "content",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "content",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "shares",
          localField: "_id",
          foreignField: "content",
          as: "shares",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
          likeCount: { $size: "$likes" },
          shareCount: { $size: "$shares" },
          isLiked: {
            $cond: {
              if: {
                $and: [
                  { $ne: [userId, null] },
                  { $ne: [userId, ""] },
                  { $in: [new mongoose.Types.ObjectId(userId), "$likes.user"] },
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: { $ifNull: ["$description", ""] },
          mediaUrl: 1,
          mediaType: { $ifNull: ["$mediaType", "video"] },
          thumbnail: { $ifNull: ["$thumbnail", null] },
          duration: { $ifNull: ["$duration", null] },
          views: { $ifNull: ["$views", 0] },
          likes: { $ifNull: ["$likes", 0] },
          shares: { $ifNull: ["$shares", 0] },
          isPublic: { $ifNull: ["$isPublic", true] },
          tags: { $ifNull: ["$tags", []] },
          location: { $ifNull: ["$location", null] },
          createdAt: 1,
          updatedAt: 1,
          commentCount: 1,
          likeCount: 1,
          shareCount: 1,
          isLiked: 1,
          user: {
            _id: "$user._id",
            fullname: "$user.fullname",
            profilePicture: "$user.profilePicture",
          },
          genre: {
            _id: "$genre._id",
            name: "$genre.name",
            slug: "$genre.slug",
          },
        },
      },
    ];

    const contents = await Content.aggregate(pipeline as any[]);
    return contents[0] || null;
  }

  // Get contents by user
  async getContentsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const contents = await Content.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullname profilePicture")
      .populate("genre", "name slug");

    const total = await Content.countDocuments({ user: userId });

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get contents by genre
  async getContentsByGenre(
    genreId: string,
    page: number = 1,
    limit: number = 10,
    userId?: string
  ) {
    return await this.getAllContents(page, limit, userId, genreId);
  }

  // Update content
  async updateContent(
    contentId: string,
    userId: string,
    data: UpdateContentData
  ): Promise<IContent | null> {
    const content = await Content.findOneAndUpdate(
      { _id: contentId, user: userId },
      data,
      { new: true, runValidators: true }
    );
    return content;
  }

  // Delete content
  async deleteContent(contentId: string, userId: string): Promise<boolean> {
    const result = await Content.deleteOne({ _id: contentId, user: userId });
    return result.deletedCount > 0;
  }

  // Increment view count
  async incrementViews(contentId: string): Promise<void> {
    await Content.findByIdAndUpdate(contentId, { $inc: { views: 1 } });
  }

  // Search contents by tags or title
  async searchContents(
    query: string,
    page: number = 1,
    limit: number = 10,
    genreId?: string
  ) {
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, "i");
    const searchFilter: any = {
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: { $in: [searchRegex] } },
      ],
    };

    if (
      genreId &&
      genreId.trim() !== "" &&
      mongoose.Types.ObjectId.isValid(genreId)
    ) {
      searchFilter.genre = new mongoose.Types.ObjectId(genreId);
    }

    const contents = await Content.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "fullname profilePicture")
      .populate("genre", "name slug");

    const total = await Content.countDocuments(searchFilter);

    return {
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
