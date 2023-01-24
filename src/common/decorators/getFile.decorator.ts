import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

/**
 * Decorator to obtain the file that Multer provides trough request.file
 * Validates if a file where sended
 */
export const GetFile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException({
        statusCode: 400,
        message: {
          file: ['file should not be empty'],
        },
        error: 'Bad Request',
      });
    }
    return request.file;
  },
);
