import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import type { ILogger } from './interfaces/Logger';
const SKIP_METHODS = new Set<string>(['OPTIONS', 'HEAD']);

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('ILogger') private logger: ILogger) {}

  use(req: any, res: any, next: any) {
    const method: string = req.method;
    const rawUrl: string = req.originalUrl || req.url || '';
    const urlPath: string = rawUrl.split('?')[0];

    if (SKIP_METHODS.has(method)) {
      return next();
    }

    const startTime = Date.now();

    res.on('finish', () => {
      const durationMs = Date.now() - startTime;
      const { statusCode } = res;
      // Determine severity
      const isServerError = statusCode >= 500;
      const isClientError = statusCode >= 400 && statusCode < 500;
      const isSlow = durationMs > 1000; // 1s threshold

      const message = `${method} ${urlPath} ${statusCode} - ${durationMs}ms`;

      if (isServerError) {
        this.logger.error(message);
      } else if (isClientError || isSlow) {
        this.logger.warn(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
