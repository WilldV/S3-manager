import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetFile, LocalFileInterceptor } from '../common';
import { S3Service } from './s3.service';
import { UploadFile } from './use-cases/UploadFile';

@Controller()
export class S3Controller {
  constructor(
    private configService: ConfigService,
    private uploadFileUseCase: UploadFile,
    private s3Service: S3Service,
  ) {}

  @Get('bucket-url')
  getBuckerURL() {
    return {
      bucketUrl: this.configService.get<string>('AWS.S3_URL'),
    };
  }

  @Post()
  @UseInterceptors(LocalFileInterceptor())
  uploadFile(
    @Body('folder') folder: string,
    @GetFile() file: Express.Multer.File,
  ) {
    return this.uploadFileUseCase.call(folder, file);
  }

  @Delete()
  async deleteFile(@Body('key') key: string) {
    await this.s3Service.delete(key);
    return {
      message: 'File deleted',
    };
  }
}
