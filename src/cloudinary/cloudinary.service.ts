import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';
import { config } from 'dotenv';
config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'articles',
          allowed_formats: ['jpg', 'png'],
        },
        (err, result: UploadApiResponse) => {
          if (err) return reject(err);
          resolve(result.secure_url);
        },
      );
      const stream = streamifier.createReadStream(file.buffer);
      stream.pipe(uploadStream);
    });
  }
}
