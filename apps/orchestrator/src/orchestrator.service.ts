import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { SendEmailDto } from '../../../libs/contracts/src/dtos/send-email.dto';
import { Services } from '@libs/contracts';

@Injectable()
export class OrchestratorService {
  constructor() // @Inject(Services.EmailInt) private readonly emailIntClient: ClientProxy,
  {}

  // async sendEmail(request: SendEmailDto): Promise<void> {
  //   try {
  //     this.emailIntClient.emit('email.send', {
  //       request,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     throw err;
  //   }
  // }
}
