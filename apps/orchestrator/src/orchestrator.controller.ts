import { JwtAuthGuard } from '@libs/common';
import { SaveInboxDto, SendEmailDto } from '@libs/contracts/email-int';
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

  @Post('/inbox')
  async saveInbox(@Body() request: SaveInboxDto): Promise<boolean> {
    return await this.orchestratorService.saveInbox(request);
  }
}
