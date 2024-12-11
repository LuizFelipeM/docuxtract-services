import { Module } from '@nestjs/common';
import { PmIntController } from './pm-int.controller';
import { PmIntService } from './pm-int.service';

@Module({
  imports: [],
  controllers: [PmIntController],
  providers: [PmIntService],
})
export class PmIntModule {}
