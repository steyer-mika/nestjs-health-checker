import { Module } from '@nestjs/common';

import { CheckHealthModule } from './check-health/check-health.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule, CheckHealthModule],
  exports: [DatabaseModule, CheckHealthModule],
})
export class ServicesModule {}
