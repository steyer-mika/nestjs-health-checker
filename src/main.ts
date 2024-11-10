import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from '@/app.module';
import { LoggerConfig } from '@/config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerConfig.new(),
  });

  const config = app.get<ConfigService>(ConfigService);

  // https://docs.nestjs.com/techniques/compression //
  app.use(compression());

  // https://docs.nestjs.com/security/helmet //
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );

  // https://docs.nestjs.com/faq/global-prefix //
  app.setGlobalPrefix('api');

  // https://docs.nestjs.com/security/cors //
  app.enableCors({
    origin: config.getOrThrow<string>('frontend.url'),
    allowedHeaders: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(config.getOrThrow<number>('app.port'));
}

bootstrap();
