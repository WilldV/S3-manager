import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { GetFile, LocalFileInterceptor } from '../common';
import { UploadFile } from './use-cases/UploadFile';

@Controller()
export class S3Controller {
  constructor(private uploadFileUseCase: UploadFile) {}

  @Post('upload')
  @UseInterceptors(LocalFileInterceptor())
  uploadFile(
    @Body('folder') folder: string,
    @GetFile() file: Express.Multer.File,
  ) {
    return this.uploadFileUseCase.call(folder, file);
  }
}
