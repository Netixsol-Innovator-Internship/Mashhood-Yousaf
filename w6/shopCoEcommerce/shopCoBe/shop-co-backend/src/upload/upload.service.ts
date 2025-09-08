// src/upload/upload.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dxizire4f',
      api_key: '277443971678621',
      api_secret: '3jfMPJnjVa1DatiAkDagbmlpoEM',
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shopco',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<any[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }
}
