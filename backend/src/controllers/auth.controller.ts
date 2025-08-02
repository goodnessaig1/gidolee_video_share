import { Request, Response } from "express";
import * as userService from "../services/user.service";

class authController {
  async register(req: Request, res: Response) {
    try {
      const newUser = await userService.createUser(req.body, req?.file);

      res.status(201).json({ message: "User registered", newUser });
    } catch (err) {
      res.status(500).json({ message: "Error registering user" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const user = await userService.findUserByEmail(req.body);

      res.json({ user });
    } catch (err) {
      res.status(400).json({ status: "Failed", message: err });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();

      res.json(users);
    } catch (err) {
      res.status(400).json({ status: "Failed", message: err });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const file = req.file; // Get uploaded file

      const updatedUser = await userService.updateUser(id, updateData, file);

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Error updating user",
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const result = await userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Error deleting user",
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const user = await userService.getUserById(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err: any) {
      res.status(404).json({
        success: false,
        message: err.message || "User not found",
      });
    }
  }
}

export default new authController();
