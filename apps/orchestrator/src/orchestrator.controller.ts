import { JwtAuthGuard } from '@libs/common';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SendEmailWf } from './dtos/send-email-wf.dto';
import { OrchestratorService } from './orchestrator.service';

@Controller('orchestrator')
@UseGuards(JwtAuthGuard)
export class OrchestratorController {
  constructor(private readonly orchestratorService: OrchestratorService) {}

  @Post('saga')
  async executeSaga(@Body() request: SendEmailWf): Promise<void> {
    return await this.orchestratorService.executeSaga(request);
  }
}
