import { Comment, IComment } from "../models/comment.model";
import { Content } from "../models/content.model";
import mongoose from "mongoose";

export interface CreateCommentData {
  content: string;
  user: string;
  text: string;
  parentComment?: string;
}

export interface UpdateCommentData {
  text: string;
}

export class CommentService {
  // Create new comment
  async createComment(data: CreateCommentData): Promise<IComment> {
    const comment = new Comment(data);
    const savedComment = await comment.save();

    // If this is a reply, update the parent comment's replies array
    if (data.parentComment) {
      await Comment.findByIdAndUpdate(data.parentComment, {
        $push: { replies: savedComment._id },
      });
    }

    return savedComment;
  }

  // Get comments for a content with pagination
  async getCommentsByContent(
    contentId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const pipeline = [
      { $match: { content: new mongoose.Types.ObjectId(contentId) } },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "comment",
          as: "likes",
        },
      },
      {
        $addFields: {
          likeCount: { $size: "$likes" },
          user: {
            _id: "$user._id",
            fullname: "$user.fullname",
            profilePicture: "$user.profilePicture",
          },
        },
      },
      {
        $project: {
          _id: 1,
          text: 1,
          parentComment: 1,
          likes: 1,
          replies: 1,
          isEdited: 1,
          createdAt: 1,
          updatedAt: 1,
          likeCount: 1,
          user: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];

    const comments = await Comment.aggregate(pipeline as any[]);
    const total = await Comment.countDocuments({ content: contentId });

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get comment by ID with user data
  async getCommentById(commentId: string) {
    const comment = await Comment.findById(commentId)
      .populate("user", "fullname profilePicture")
      .populate("replies", "text user createdAt")
      .populate({
        path: "replies",
        populate: {
          path: "user",
          select: "fullname profilePicture",
        },
      });

    return comment;
  }

  // Get replies for a comment
  async getRepliesByComment(
    commentId: string,
    page: number = 1,
    limit: number = 10
  ) {
    const skip = (page - 1) * limit;

    const replies = await Comment.find({ parentComment: commentId })
      .populate("user", "fullname profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ parentComment: commentId });

    return {
      replies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Update comment
  async updateComment(
    commentId: string,
    userId: string,
    data: UpdateCommentData
  ): Promise<IComment | null> {
    const comment = await Comment.findOneAndUpdate(
      { _id: commentId, user: userId },
      { ...data, isEdited: true },
      { new: true, runValidators: true }
    );
    return comment;
  }

  // Delete comment
  async deleteComment(commentId: string, userId: string): Promise<boolean> {
    const comment = await Comment.findById(commentId);

    if (!comment) return false;

    // If this comment has replies, just mark it as deleted instead of removing
    if (comment.replies && comment.replies.length > 0) {
      await Comment.findByIdAndUpdate(commentId, {
        text: "[Comment deleted]",
        isEdited: true,
      });
      return true;
    }

    // If it's a reply, remove it from parent's replies array
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(comment.parentComment, {
        $pull: { replies: commentId },
      });
    }

    const result = await Comment.deleteOne({ _id: commentId, user: userId });
    return result.deletedCount > 0;
  }

  // Get comments by user
  async getCommentsByUser(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ user: userId })
      .populate("content", "title mediaUrl")
      .populate("user", "fullname profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ user: userId });

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
