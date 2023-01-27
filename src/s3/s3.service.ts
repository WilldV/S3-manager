import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';

@Injectable()
export class S3Service {
  private S3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.S3Client = new S3Client({
      apiVersion: '2006-03-01',
      region: this.configService.get<string>('AWS.REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS.ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS.SECRET_KEY'),
      },
    });
  }

  /**
   * Upload a file to S3
   *
   * @param key represents name and location of file on S3
   * @param filename name of file located on FILES_FOLDER configurated
   * @param mimetype of file. ex: img/jpeg or application/pdf
   */
  async upload(key: string, filename: string, mimetype: string) {
    const filesFolder = this.configService.get<string>('FILES_FOLDER');

    const fileContent = await readFile(`${filesFolder}/${filename}`);

    const uploadCommand = new PutObjectCommand({
      Key: key,
      Bucket: this.configService.get<string>('AWS.BUCKET_NAME'),
      ContentType: mimetype,
      Body: fileContent,
    });

    await this.S3Client.send(uploadCommand);
  }

  /**
   * Delete a file on S3
   *
   * @param key represents name and location of file on S3
   */
  async delete(key: string) {
    const deleteCommand = new DeleteObjectCommand({
      Key: key,
      Bucket: this.configService.get<string>('AWS.BUCKET_NAME'),
    });

    await this.S3Client.send(deleteCommand);
  }
}
