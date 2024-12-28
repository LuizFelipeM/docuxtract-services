import { Module } from '@nestjs/common';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { PmIntController } from './pm-int.controller';
import { PmIntService } from './pm-int.service';

@Module({
  imports: [],
  controllers: [HealthcheckController, PmIntController],
  providers: [PmIntService],
})
export class PmIntModule {}
