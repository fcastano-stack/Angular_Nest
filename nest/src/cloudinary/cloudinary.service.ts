import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {

  uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {

      // Abre un canal de subida hacia Cloudinary y guarda en la carpeta "escuelas"
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'escuelas' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!);
        },
      );

      // Convierte el buffer del archivo en un stream y lo envía a Cloudinary
      Readable.from(file.buffer).pipe(upload);
    });
  }
}
