import { Controller, Get } from '@nestjs/common';
import { PmIntService } from './pm-int.service';

@Controller()
export class PmIntController {
  constructor(private readonly pmIntService: PmIntService) {}

  @Get()
  getHello(): string {
    return this.pmIntService.getHello();
  }
}
