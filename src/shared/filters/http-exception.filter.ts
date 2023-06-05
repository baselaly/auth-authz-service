import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorClass } from '../classes/error.class';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errMessage: string | object =
      exception instanceof HttpException ? exception.getResponse() : { message: 'UNKNOWN_ERROR' };

    const errorType: string = errMessage['error'];
    const errors = [];

    if (Array.isArray(errMessage['message'])) {
      for (const row of errMessage['message']) {
        errors.push(row);
      }
    } else {
      errors.push(errMessage['message'] ?? errMessage);
    }
    response.status(status).send(new ErrorClass(status, errors, errorType, request.url));
  }
}
