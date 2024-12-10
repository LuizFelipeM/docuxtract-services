import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { SendEmailRequest } from '../dto/send-email.request';
import { JwtAuthGuard } from '@libs/common';

@Controller('orchestrator')
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendEmail(@Body() request: SendEmailRequest): Promise<void> {
    console.log('request', request);
    await this.orchestratorService.sendEmail(request);
  }
}
