import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserById } from "../services/user.service";

export const isLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await getUserById(decoded.id);

    (req as { user?: any }).user = {
      _id: user?._id.toString(),
      role: user?.role,
      email: user?.email,
    };
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid token" });
    return;
  }
};
