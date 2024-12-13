import { JwtAuthGuard } from '@libs/common';
import { SendEmailDto } from '@libs/contracts/email-int';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';

@Controller('orchestrator')
@UseGuards(JwtAuthGuard)
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post()
  async sendEmail(@Body() request: SendEmailDto): Promise<void> {
    await this.orchestratorService.sendEmail(request);
  }
}
