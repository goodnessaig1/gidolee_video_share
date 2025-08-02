import mongoose, { Document, Schema } from "mongoose";

export interface IContent extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  mediaUrl: string;
  likes: number;
  shares: number;
  isPublic: boolean;
  tags: string[];
  location?: string;
  genre: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const contentSchema = new Schema<IContent>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    mediaUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
  },
  {
    timestamps: true,
  }
);

contentSchema.index({ user: 1, createdAt: -1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ isPublic: 1, createdAt: -1 });
contentSchema.index({ genre: 1 });

export const Content = mongoose.model<IContent>("Content", contentSchema);
