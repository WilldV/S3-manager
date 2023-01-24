import { FileInterceptor } from '@nestjs/platform-express';
import {
  BadRequestException,
  Injectable,
  mixin,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extname } from 'path';
import { ConfigService } from '@nestjs/config';

/**
 *
 * Contains all Multer configuration and validations
 *
 * @returns a custom interceptor with Multer configuration
 */
export function LocalFileInterceptor(): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    allowedMimetypes = [
      'image/png',
      'image/jpeg',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
    ];

    fileInterceptor: NestInterceptor;
    constructor(private configService: ConfigService) {
      const filesDestination = this.configService.get<string>('FILES_FOLDER');
      const destination = filesDestination;

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (_req, file, cb) => {
            cb(null, `${nanoid(12)}${extname(file.originalname)}`);
          },
        }),
        fileFilter: (_req, file, cb) => {
          if (!this.allowedMimetypes.includes(file.mimetype)) {
            cb(
              new BadRequestException({
                statusCode: 400,
                message: {
                  file: ['file should be an image or a pdf'],
                },
                error: 'Bad Request',
              }),
              false,
            );
          }

          cb(null, true);
        },
      };

      this.fileInterceptor = new (FileInterceptor('file', multerOptions))();
    }

    async intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}
