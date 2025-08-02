import mongoose, { Document, Schema } from "mongoose";

export interface IShare extends Document {
  user: mongoose.Types.ObjectId;
  content: mongoose.Types.ObjectId;
  platform?: string; // e.g., "facebook", "twitter", "whatsapp"
  shareUrl?: string;
  createdAt: Date;
}

const shareSchema = new Schema<IShare>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: Schema.Types.ObjectId, ref: "Content", required: true },
    platform: { type: String, trim: true },
    shareUrl: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for better query performance
shareSchema.index({ content: 1, createdAt: -1 });
shareSchema.index({ user: 1, createdAt: -1 });
shareSchema.index({ platform: 1 });

export const Share = mongoose.model<IShare>("Share", shareSchema);
