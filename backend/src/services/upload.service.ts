import s3Client from "../middleware/s3.config";
import { UploadedFileType } from "../types/upload.type";
import crypto from "crypto";
import path from "path";

class UploadService {
  async getPublicUrl(key: string): Promise<string> {
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async uploadFile(
    buffer: Buffer,
    fileName: string,
    mimetype: string
  ): Promise<UploadedFileType & { fileSize: number }> {
    // const key = `uploads/${Date.now()}-${fileName}`;
    const ext = path.extname(fileName);

    const shortName = crypto.randomBytes(6).toString("base64url").slice(0, 10);

    const key = `uploads/${Date.now()}-${shortName}${ext}`;

    await s3Client
      .putObject({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: "public-read",
        ContentLength: buffer.length,
      })
      .promise();

    return {
      url: await this.getPublicUrl(key),
      key,
      bucket: process.env.AWS_BUCKET_NAME!,
      contentType: mimetype,
      fileSize: buffer.length,
    };
  }
}

export default new UploadService();
