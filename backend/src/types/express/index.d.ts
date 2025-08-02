import { Request } from "express";

declare module "express" {
  export interface Request {
    file?: Express.Multer.File;
    user: {
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
