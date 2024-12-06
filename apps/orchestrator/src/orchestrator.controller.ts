import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { SendEmailRequest } from '../dto/send-email.request';

@Controller('orchestrator')
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Get()
  getHello(): string {
    return 'Hello world!';
  }

  @Post()
  async sendEmail(@Body() request: SendEmailRequest): Promise<void> {
    await this.orchestratorService.sendEmail(request);
  }
}
