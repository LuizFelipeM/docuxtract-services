import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service';
import { SendEmailDto } from '../../../libs/contracts/src/dtos/send-email.dto';
import { JwtAuthGuard } from '@libs/common';

@Controller('orchestrator')
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async sendEmail(@Body() request: SendEmailDto): Promise<void> {
    await this.orchestratorService.sendEmail(request);
  }
}
