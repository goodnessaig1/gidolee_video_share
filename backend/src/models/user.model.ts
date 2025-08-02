import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  profilePicture: string;
  role: string;
}

const userSchema = new Schema<IUser>({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
});

export const User = mongoose.model<IUser>("User", userSchema);
