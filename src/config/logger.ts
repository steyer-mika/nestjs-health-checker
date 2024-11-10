import { type LoggerService } from '@nestjs/common';
import { WinstonModule, utilities } from 'nest-winston';
import { join } from 'path';
import { format, transports } from 'winston';

import load from '@/config/environment';

const getLogLevel = (environment: string | undefined) => {
  switch (environment) {
    case 'local':
    case 'development':
      return 'debug';

    case 'staging':
    case 'production':
      return 'info';

    default: {
      console.warn(
        `Unknown environment: ${environment}. Defaulting to 'info' log level.`,
      );
      return 'info';
    }
  }
};

export class LoggerConfig {
  public static new(): LoggerService {
    const environment = load();

    const level = getLogLevel(environment.env);

    if (!environment.app.name) {
      console.warn('No application name provided. Defaulting to "NestWinston"');
    }

    return WinstonModule.createLogger({
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.ms(),
            utilities.format.nestLike(environment.app.name, {
              colors: true,
              appName: true,
              prettyPrint: true,
            }),
          ),
        }),
        new transports.File({
          dirname: join(__dirname, `./../../logs/${level}/`),
          filename: `${level}.log`,
          level,
          format: format.combine(
            format.ms(),
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            utilities.format.nestLike(environment.app.name, {
              colors: false,
              prettyPrint: true,
              appName: true,
              processId: true,
            }),
          ),
        }),
      ],
    });
  }
}
