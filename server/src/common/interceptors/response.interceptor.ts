import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    return next.handle().pipe(
      map((data) => {
        const status = response.statusCode ?? 200;
        return {
          message: '',
          data: data === undefined ? null : data,
          status,
        };
      }),
      catchError((err) => {
        // Normalize thrown errors into { message, data, status }
        let status = response.statusCode ?? 500;
        let message = 'Internal server error';
        let data: any = null;

        try {
          if (err?.getStatus && typeof err.getStatus === 'function') {
            status = err.getStatus();
          }
        } catch (e) {}

        if (err && typeof err === 'object') {
          if ('response' in err && err.response) {
            // axios-like error
            const r = err.response;
            message =
              r?.data?.message ??
              r?.data ??
              r?.message ??
              err.message ??
              message;
            data = r?.data ?? null;
            status = r?.status ?? status;
          } else if ('message' in err) {
            message = err.message;
            data = Object.keys(err).length ? { ...err } : null;
          } else {
            data = err;
          }
        } else if (typeof err === 'string') {
          message = err;
        }

        // ensure response status is set
        try {
          response.status(status);
        } catch (e) {}

        return of({ message, data, status });
      }),
    );
  }
}
