import { Module } from '@nestjs/common';

import { DatabaseModule } from '@/services/database/database.module';

import { ObserverController } from './observer.controller';
import { ObserverService } from './observer.service';

@Module({
  imports: [DatabaseModule],
  providers: [ObserverService],
  controllers: [ObserverController],
  exports: [ObserverService],
})
export class ObserverModule {}
