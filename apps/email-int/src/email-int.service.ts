import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailIntService {
  private readonly logger = new Logger(EmailIntService.name);

  getHello(): string {
    return 'Hello World!';
  }

  sendEmail(data: any) {
    this.logger.log('Received data: ', data);
  }
}
