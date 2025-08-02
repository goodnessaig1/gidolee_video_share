import { User, IUser } from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import uploadService from "./upload.service";

export const createUser = async (data: IUser, file: any) => {
  const { email, password, fullName, role } = data;

  const user = await User.findOne({ email });
  if (user) {
    throw new Error("This user already exist");
  }

  let profilePicture: string | undefined;

  if (file) {
    const { buffer, originalname, mimetype } = file;
    const result = await uploadService.uploadFile(
      buffer,
      originalname,
      mimetype
    );
    profilePicture = result.url;
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUserData = {
    fullName,
    email,
    password: hashed,
    profilePicture,
    role,
  };
  const newUser = await User.create(newUserData);
  return newUser;
};

export const findUserByEmail = async (data: {
  email: string;
  password: string;
}) => {
  const { email, password } = data;

  const user = await User.findOne({ email });
  if (!user) {
    throw "This user does not exist";
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw "Invalid password";
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return {
    ...user.toObject(),
    token,
  };
};
export const getAllUsers = async () => {
  const user = await User.find();

  return {
    user,
  };
};

export const updateUser = async (
  userId: string,
  updateData: Partial<IUser>,
  file?: any
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // Handle profile picture upload
  if (file) {
    const { buffer, originalname, mimetype } = file;
    const result = await uploadService.uploadFile(
      buffer,
      originalname,
      mimetype
    );
    updateData.profilePicture = result.url;
  }

  // If password is being updated, hash it
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  // If email is being updated, check if it's already taken
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser) {
      throw new Error("Email already exists");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedUser;
};

export const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  await User.findByIdAndDelete(userId);
  return { message: "User deleted successfully" };
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
