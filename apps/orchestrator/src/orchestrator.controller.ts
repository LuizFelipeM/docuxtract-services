import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { SendEmailRequest } from '../dto/send-email.request';
import { JwtAuthGuard } from '@libs/common';
import { Services } from '@libs/contracts';
import { ClientProxy } from '@nestjs/microservices';

@Controller('orchestrator')
export class OrchestratorController {
  constructor(
    private readonly orchestratorService: OrchestratorService,
    @Inject(Services.Auth) private readonly authClient: ClientProxy,
  ) {}

  @Get()
  getHello() {
    console.log('first');
    this.orchestratorService.test();
  }

  @Post('verify')
  async verify() {
    const a = this.authClient.send('auth/verify', { name: 'abacate' });
    a.subscribe((val) => console.log(val));
  }

  @Post('test')
  test() {
    this.orchestratorService.test();
  }

  @Post()
  // @UseGuards(JwtAuthGuard)
  async sendEmail(@Body() request: SendEmailRequest): Promise<void> {
    console.log('request', request);
    await this.orchestratorService.sendEmail(request);
  }
}
