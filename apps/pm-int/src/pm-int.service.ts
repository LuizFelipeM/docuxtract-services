import { Injectable } from '@nestjs/common';

@Injectable()
export class PmIntService {
  getHello(): string {
    return 'Hello World!';
  }
}
