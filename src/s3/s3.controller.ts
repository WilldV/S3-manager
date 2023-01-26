import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetFile, LocalFileInterceptor } from '../common';
import { UploadFile } from './use-cases/UploadFile';

@Controller()
export class S3Controller {
  constructor(
    private configService: ConfigService,
    private uploadFileUseCase: UploadFile,
  ) {}

  @Get('bucket-url')
  getBuckerURL() {
    return {
      bucketUrl: this.configService.get<string>('AWS.S3_URL'),
    };
  }

  @Post('upload')
  @UseInterceptors(LocalFileInterceptor())
  uploadFile(
    @Body('folder') folder: string,
    @GetFile() file: Express.Multer.File,
  ) {
    return this.uploadFileUseCase.call(folder, file);
  }
}
