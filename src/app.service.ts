import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async index() {
    return { message: 'Hello world!' };
  }
}
