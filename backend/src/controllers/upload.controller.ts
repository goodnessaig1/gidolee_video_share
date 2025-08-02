import { Request, Response } from "express";
import uploadService from "../services/upload.service";
import multer from "multer";
interface MulterRequest extends Request {
  file: Express.Multer.File;
}

class UploadController {
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req?.file) {
        return res.status(401).json({ message: "No file uploaded" });
      }

      const { buffer, originalname, mimetype } = req?.file;
      const result = await uploadService.uploadFile(
        buffer,
        originalname,
        mimetype
      );

      res.status(201).json({
        success: true,
        data: result,
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

export default new UploadController();
