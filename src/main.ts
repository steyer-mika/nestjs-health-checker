import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from '@/app.module';
import { LoggerConfig } from '@/config/logger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: LoggerConfig.new(),
  });

  const config = app.get<ConfigService>(ConfigService);

  // https://docs.nestjs.com/techniques/compression //
  app.use(compression());

  // https://docs.nestjs.com/security/helmet //
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
      contentSecurityPolicy: false,
    }),
  );

  // https://docs.nestjs.com/security/cors //
  app.enableCors({
    origin: config.getOrThrow<string>('frontend.url'),
    allowedHeaders: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // https://docs.nestjs.com/techniques/mvc //
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(config.getOrThrow<number>('app.port'));
}

void bootstrap();
