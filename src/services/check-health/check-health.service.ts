import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthCheckResult } from '@nestjs/terminus';

import { ObserverDto } from '@/api/observer/observer.schema';
import { ObserverService } from '@/api/observer/observer.service';
import { catchError, firstValueFrom, of } from 'rxjs';

type ObserverHealth = {
  observer: ObserverDto;
  healthCheck: Readonly<HealthCheckResult> | null;
};

@Injectable()
export class CheckHealthService {
  constructor(
    private readonly observerService: ObserverService,
    private readonly httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async checkHealth(): Promise<void> {
    try {
      const observers = this.observerService.findMany((x) => x.isActive);

      if (observers.length === 0) {
        Logger.log('No active observers found.', 'CheckHealthService');
        return;
      }

      const healthChecks = await Promise.all(
        observers.map((observer) => this.getObserverHealth(observer)),
      );

      console.log(healthChecks);
      // TODO: Handle health checks
    } catch (error) {
      Logger.error(error, 'CheckHealthService');
    }
  }

  private async getObserverHealth(
    observer: ObserverDto,
  ): Promise<ObserverHealth> {
    const response = await firstValueFrom(
      this.httpService
        .get<HealthCheckResult>(observer.url)
        .pipe(catchError(() => of(null))),
    );

    if (!response) {
      return {
        observer,
        healthCheck: null,
      };
    }

    return {
      observer,
      healthCheck: response.data,
    };
  }
}
