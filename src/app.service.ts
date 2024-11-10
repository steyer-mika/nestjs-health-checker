import { Injectable } from '@nestjs/common';

import { ObserverService } from '@/api/observer/observer.service';

@Injectable()
export class AppService {
  constructor(private readonly observerService: ObserverService) {}

  async index() {
    const observers = await this.observerService.findAll();

    return { observers };
  }
}
