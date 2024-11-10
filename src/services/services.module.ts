import { Module } from '@nestjs/common';

import { CheckHealthModule } from './check-health/check-health.module';
import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [DatabaseModule, CheckHealthModule, MailModule],
  exports: [DatabaseModule, CheckHealthModule],
})
export class ServicesModule {}
