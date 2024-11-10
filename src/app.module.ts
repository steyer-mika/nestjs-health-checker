import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { ApiModule } from '@/api/api.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import environment from '@/config/environment';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { DatabaseService } from '@/services/database/database.service';
import { ServicesModule } from '@/services/services.module';
import { ZodValidationPipe } from 'nestjs-zod';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [environment],
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('throttler.ttl'),
          limit: configService.getOrThrow<number>('throttler.limit'),
        },
      ],
    }),

    ServicesModule,
    ApiModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: DatabaseService,
      useFactory: () => new DatabaseService(),
    },

    AppService,
  ],

  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
