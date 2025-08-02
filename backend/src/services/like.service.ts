import { Like, ILike } from "../models/like.model";
import { Content } from "../models/content.model";
import { Comment } from "../models/comment.model";

export interface CreateLikeData {
  user: string;
  content?: string;
  comment?: string;
  type: "content" | "comment";
}

export class LikeService {
  // Toggle like on content or comment
  async toggleLike(
    data: CreateLikeData
  ): Promise<{ liked: boolean; likeCount: number }> {
    const { user, content, comment, type } = data;

    // Check if like already exists
    const existingLike = await Like.findOne({
      user,
      [type]: type === "content" ? content : comment,
      type,
    });

    if (existingLike) {
      // Unlike
      await Like.findByIdAndDelete(existingLike._id);

      // Decrement count
      if (type === "content" && content) {
        await Content.findByIdAndUpdate(content, { $inc: { likes: -1 } });
      } else if (type === "comment" && comment) {
        await Comment.findByIdAndUpdate(comment, { $inc: { likes: -1 } });
      }

      const likeCount = await Like.countDocuments({
        [type]: type === "content" ? content : comment,
        type,
      });

      return { liked: false, likeCount };
    } else {
      // Like
      const newLike = new Like(data);
      await newLike.save();

      // Increment count
      if (type === "content" && content) {
        await Content.findByIdAndUpdate(content, { $inc: { likes: 1 } });
      } else if (type === "comment" && comment) {
        await Comment.findByIdAndUpdate(comment, { $inc: { likes: 1 } });
      }

      const likeCount = await Like.countDocuments({
        [type]: type === "content" ? content : comment,
        type,
      });

      return { liked: true, likeCount };
    }
  }

  // Check if user has liked content or comment
  async isLikedByUser(
    userId: string,
    type: "content" | "comment",
    contentId?: string,
    commentId?: string
  ): Promise<boolean> {
    const like = await Like.findOne({
      user: userId,
      [type]: type === "content" ? contentId : commentId,
      type,
    });
    return !!like;
  }

  // Get like count for content or comment
  async getLikeCount(
    type: "content" | "comment",
    contentId?: string,
    commentId?: string
  ): Promise<number> {
    const count = await Like.countDocuments({
      [type]: type === "content" ? contentId : commentId,
      type,
    });
    return count;
  }

  // Get users who liked content or comment
  async getLikedUsers(
    type: "content" | "comment",
    contentId?: string,
    commentId?: string,
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const likes = await Like.find({
      [type]: type === "content" ? contentId : commentId,
      type,
    })
      .populate("user", "fullname profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Like.countDocuments({
      [type]: type === "content" ? contentId : commentId,
      type,
    });

    return {
      users: likes.map((like) => like.user),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Get likes by user
  async getLikesByUser(
    userId: string,
    type?: "content" | "comment",
    page: number = 1,
    limit: number = 20
  ) {
    const skip = (page - 1) * limit;

    const query: any = { user: userId };
    if (type) {
      query.type = type;
    }

    const likes = await Like.find(query)
      .populate("content", "title mediaUrl thumbnail")
      .populate("comment", "text")
      .populate("user", "fullname profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Like.countDocuments(query);

    return {
      likes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Remove like
  async removeLike(
    userId: string,
    type: "content" | "comment",
    contentId?: string,
    commentId?: string
  ): Promise<boolean> {
    const like = await Like.findOneAndDelete({
      user: userId,
      [type]: type === "content" ? contentId : commentId,
      type,
    });

    if (like) {
      // Decrement count
      if (type === "content" && contentId) {
        await Content.findByIdAndUpdate(contentId, { $inc: { likes: -1 } });
      } else if (type === "comment" && commentId) {
        await Comment.findByIdAndUpdate(commentId, { $inc: { likes: -1 } });
      }
      return true;
    }

    return false;
  }
}
