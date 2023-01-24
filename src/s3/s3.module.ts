import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { UploadFile } from './use-cases/UploadFile';

@Module({
  providers: [S3Service, UploadFile],
  controllers: [S3Controller],
})
export class S3Module {}
