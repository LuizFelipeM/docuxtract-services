import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendEmailRequest } from '../dto/send-email.request';
import { Services } from '@libs/contracts';
import { tap } from 'rxjs';

@Injectable()
export class OrchestratorService {
  constructor(
    @Inject(Services.EmailInt) private readonly emailIntClient: ClientProxy,
  ) {}

  test() {
    this.emailIntClient
      .send({ cmd: 'email.test' }, { name: 'abacate' })
      .subscribe((val) => console.log('val', val));
  }

  async sendEmail(request: SendEmailRequest): Promise<void> {
    try {
      this.emailIntClient.emit('email.send', {
        request,
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
