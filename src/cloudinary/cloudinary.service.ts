import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'articles',
          allowed_formats: ['jpg', 'png', 'jpeg'],
        },
        (
          err: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (err) return reject(new InternalServerErrorException(err.message));
          if (result) return resolve(result.secure_url);
          reject(
            new InternalServerErrorException('Upload failed: Unknown error'),
          );
        },
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }
}
