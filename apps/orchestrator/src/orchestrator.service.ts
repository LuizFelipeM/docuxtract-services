import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_INT_SERVICE } from './constants/services';
import { ClientProxy } from '@nestjs/microservices';
import { SendEmailRequest } from '../dto/send-email.request';

@Injectable()
export class OrchestratorService {
  constructor(
    @Inject(EMAIL_INT_SERVICE) private readonly emailIntClient: ClientProxy,
  ) {}

  async sendEmail(request: SendEmailRequest): Promise<void> {
    try {
      this.emailIntClient.emit('send_email', {
        request,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
