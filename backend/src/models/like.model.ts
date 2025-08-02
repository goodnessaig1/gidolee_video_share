import mongoose, { Document, Schema } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  content?: mongoose.Types.ObjectId; // for content likes
  comment?: mongoose.Types.ObjectId; // for comment likes
  type: "content" | "comment";
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: Schema.Types.ObjectId, ref: "Content" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
    type: { type: String, enum: ["content", "comment"], required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Compound indexes for better query performance
likeSchema.index({ user: 1, content: 1 }, { unique: true, sparse: true });
likeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });
likeSchema.index({ content: 1, type: 1 });
likeSchema.index({ comment: 1, type: 1 });

export const Like = mongoose.model<ILike>("Like", likeSchema);
