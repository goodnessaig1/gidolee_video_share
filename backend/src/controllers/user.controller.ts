import { Request, Response } from "express";
import { getUserById } from "../services/user.service";

class UserController {
  async getSignedInUser(req: Request, res: Response) {
    try {
      const id = (req as any).user._id;
      const user = await getUserById(id);

      res.status(201).json({
        success: true,
        data: user,
        message: "File uploaded successfully",
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }
  }
}

export default new UserController();
