import { Injectable, Logger, type NestMiddleware } from '@nestjs/common';
import { type NextFunction, type Request, type Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl } = request;

    response.on('finish', () => {
      this.logger.log(`${method} ${originalUrl} ${response.statusCode} `);
    });

    next();
  }
}
