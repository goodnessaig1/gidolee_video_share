import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  content: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  text: string;
  parentComment?: mongoose.Types.ObjectId; // for nested replies
  likes: number;
  replies: mongoose.Types.ObjectId[];
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" }, // for nested replies
    likes: { type: Number, default: 0 },
    replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    isEdited: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
commentSchema.index({ content: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

export const Comment = mongoose.model<IComment>("Comment", commentSchema);
