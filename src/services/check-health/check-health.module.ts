import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { ObserverModule } from '@/api/observer/observer.module';

import { CheckHealthService } from './check-health.service';

@Module({
  imports: [ObserverModule, HttpModule],
  providers: [CheckHealthService],
})
export class CheckHealthModule {}
