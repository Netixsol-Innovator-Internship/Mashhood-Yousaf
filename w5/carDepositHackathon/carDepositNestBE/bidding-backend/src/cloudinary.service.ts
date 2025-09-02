// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: 'dxizire4f',
      api_key: '277443971678621',
      api_secret: '3jfMPJnjVa1DatiAkDagbmlpoEM',
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'cars' }, (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || '');
        })
        .end(file.buffer);
    });
  }
}
