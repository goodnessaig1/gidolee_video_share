import { Request, Response, NextFunction } from "express";

export const roleAuthorization = (role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !role.includes(user.role)) {
      res.status(403).json({ message: "You are not authorized" });
      return;
    }
    next();
  };
};
