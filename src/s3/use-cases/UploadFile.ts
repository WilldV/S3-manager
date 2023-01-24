import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { unlink } from 'fs/promises';
import { S3Service } from '../s3.service';

@Injectable()
export class UploadFile {
  constructor(
    private configService: ConfigService,
    private s3Service: S3Service,
  ) {}

  /**
   * Form key to upload file to S3
   *
   * @param folder name to storage the file on S3 ex: categories
   * @param file provided by Multer
   * @returns the formed key and the fileUrl ready to use
   */
  async call(folder: string, file: Express.Multer.File) {
    try {
      const key = folder ? `${folder}/${file.filename}` : file.filename;

      await this.s3Service.upload(key, file.filename, file.mimetype);

      const S3_URL = this.configService.get<string>('AWS.S3_URL');

      const fileUrl = `${S3_URL}/${key}`;

      return {
        key,
        fileUrl,
      };
    } catch (error) {
      throw error;
    } finally {
      await unlink(`${file.destination}/${file.filename}`);
    }
  }
}
