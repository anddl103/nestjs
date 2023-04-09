import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // 성공시 statusCode 는 200 으로 통일
    const success = true;
    const statusCode = 200;
    const response = context.switchToHttp().getResponse();
    response.status(statusCode);

    return next.handle().pipe(
      map((data) => ({
        success: success,
        statusCode: statusCode,
        message: data.message,
        data: data.data,
        pageInfo: data.pageInfo,
      })),
    );
  }
}
