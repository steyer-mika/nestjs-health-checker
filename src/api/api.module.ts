import { Module } from '@nestjs/common';

import { ObserverModule } from './observer/observer.module';

@Module({
  imports: [ObserverModule],
  exports: [ObserverModule],
})
export class ApiModule {}
