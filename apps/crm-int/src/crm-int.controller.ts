import { Controller, Get } from '@nestjs/common';
import { CrmIntService } from './crm-int.service';

@Controller()
export class CrmIntController {
  constructor(private readonly crmIntService: CrmIntService) {}

  @Get()
  getHello(): string {
    return this.crmIntService.getHello();
  }
}
