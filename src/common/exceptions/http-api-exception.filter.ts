import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpApiExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const error = exception.getResponse() as
      | string
      | {
          error: string;
          statusCode: number;
          message: string[];
        };
    // json 포맷을 맞추기 위해 success 항목 추가
    const success = false;
    //const data = {};
    //const pageInfo = {};
    if (typeof error === 'string') {
      this.logger.error('string: ' + error);
      response.status(status).json({
        success: success,
        statusCode: status,
        message: error,
      });
    } else {
      this.logger.error('etc: ' + error);
      response.status(status).json({ success: success, ...error });
    }
  }
}
