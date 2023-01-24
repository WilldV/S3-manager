import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFile } from 'fs/promises';

@Injectable()
export class S3Service {
  private S3Client: AWS.S3;

  constructor(private configService: ConfigService) {
    AWS.config.update({
      region: this.configService.get<string>('AWS.REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS.ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS.SECRET_KEY'),
      },
    });

    this.S3Client = new AWS.S3({ apiVersion: '2006-03-01' });
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

    await this.S3Client.upload({
      Bucket: this.configService.get<string>('AWS.BUCKET_NAME'),
      Key: key,
      ContentType: mimetype,
      Body: fileContent,
    }).promise();
  }

  /**
   * Delete a file on S3
   *
   * @param key represents name and location of file on S3
   */
  async delete(key: string) {
    await this.S3Client.deleteObject({
      Bucket: this.configService.get<string>('AWS.BUCKET_NAME'),
      Key: key,
    }).promise();
  }
}
