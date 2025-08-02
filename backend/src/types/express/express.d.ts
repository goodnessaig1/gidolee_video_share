// src/types/express/index.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      user?: {
        // Make it optional with ?
        _id: string;
        role: string;
        email: string;
      };
      files?:
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[];
    }
  }
}
