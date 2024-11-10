import { HttpModule } from '@nestjs/axios';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';

import { ApiModule } from '@/api/api.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import environment from '@/config/environment';
import { LoggerMiddleware } from '@/middleware/logger.middleware';
import { DatabaseService } from '@/services/database/database.service';
import { ServicesModule } from '@/services/services.module';

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

    HttpModule.register({}),

    ScheduleModule.forRoot(),

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
