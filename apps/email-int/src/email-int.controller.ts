import { Controller, Get } from '@nestjs/common';
import { EmailIntService } from './email-int.service';

@Controller()
export class EmailIntController {
  constructor(private readonly emailIntService: EmailIntService) {}

  @Get()
  getHello(): string {
    return this.emailIntService.getHello();
  }
}
