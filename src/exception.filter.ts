import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  /**
   * Format all possible exceptions of app
   *
   * @param exception every exception that the app could throw
   * @param host contains the http context of execution (request, response)
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    console.error('AllExceptionsFilter:', exception);

    const ctx = host.switchToHttp();

    const response = ctx.getResponse();

    let httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody;

    if ([400, 401, 404].includes(httpStatus)) {
      responseBody = exception['response'];
    } else if (httpStatus == 500 && exception['code'] == 'MISSING_FIELD_NAME') {
      httpStatus = 400;
      responseBody = {
        statusCode: 400,
        message: {
          file: ['file should not be empty'],
        },
        error: 'Bad Request',
      };
    } else {
      responseBody = {
        statusCode: httpStatus,
        message: 'Something unexpected happened',
        error: 'Internal Server Error',
      };
    }
    response.status(httpStatus).json(responseBody);
  }
}
