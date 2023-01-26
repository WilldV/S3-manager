import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard, GetFile, LocalFileInterceptor } from '../common';
import { API_KEY_HEADER } from '../common/const';
import {
  DeleteFileRequestDto,
  DeleteFileResponseDto,
  GetBucketURLResponseDto,
  UploadFileRequestDto,
  UploadFileResponseDto,
} from './dto';
import { S3Service } from './s3.service';
import { UploadFile } from './use-cases/UploadFile';

@Controller()
export class S3Controller {
  constructor(
    private configService: ConfigService,
    private uploadFileUseCase: UploadFile,
    private s3Service: S3Service,
  ) {}

  @ApiOkResponse({
    description: 'Returns base URL of the S3 bucket to access files',
    type: GetBucketURLResponseDto,
  })
  @Get('bucket-url')
  getBuckerURL(): GetBucketURLResponseDto {
    return {
      bucketUrl: this.configService.get<string>('AWS.S3_URL'),
    };
  }

  @Post()
  @ApiOkResponse({
    description: 'Returns the file key and URL after uploading a file',
    type: UploadFileResponseDto,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileRequestDto,
  })
  @ApiSecurity(API_KEY_HEADER)
  @UseGuards(AuthGuard)
  @UseInterceptors(LocalFileInterceptor())
  uploadFile(
    @Body() { folder }: UploadFileRequestDto,
    @GetFile() file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    return this.uploadFileUseCase.call(folder, file);
  }

  @ApiOkResponse({
    description: 'Returns a success message after deleting a file',
    type: DeleteFileResponseDto,
  })
  @ApiSecurity(API_KEY_HEADER)
  @UseGuards(AuthGuard)
  @Delete()
  async deleteFile(
    @Body() { key }: DeleteFileRequestDto,
  ): Promise<DeleteFileResponseDto> {
    await this.s3Service.delete(key);
    return {
      message: 'File deleted',
    };
  }
}
