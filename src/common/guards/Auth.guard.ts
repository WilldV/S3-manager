import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { API_KEY_HEADER } from '../const';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  validateRequest({
    headers,
  }: Request): boolean | Promise<boolean> | Observable<boolean> {
    const apiKey =
      headers[API_KEY_HEADER] || headers[API_KEY_HEADER.toLowerCase()];

    if (!apiKey) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'API KEY is required',
        code: 'UNAUTHORIZED',
      });
    }

    if (!process.env.ALLOWED_API_KEYS?.includes(apiKey)) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Invalid API KEY',
        code: 'UNAUTHORIZED',
      });
    }

    return true;
  }
}
