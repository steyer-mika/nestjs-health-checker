import { Injectable } from '@nestjs/common';

import { ObserverService } from '@/api/observer/observer.service';

@Injectable()
export class AppService {
  constructor(private readonly observerService: ObserverService) {}

  index() {
    const observers = this.observerService.findAll();

    return { observers };
  }
}
