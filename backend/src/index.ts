import { connectDB } from "./config/db";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import contentRoutes from "./routes/content.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";
import shareRoutes from "./routes/share.routes";
import uploadRoutes from "./routes/upload.routes";
import userRoutes from "./routes/user.routes";
import genreRoutes from "./routes/genre.routes";

import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
const port = 4000;

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Node.js + TypeScript!");
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/shares", shareRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/genres", genreRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
