import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailIntService {
  getHello(): string {
    return 'Hello World!';
  }
}
