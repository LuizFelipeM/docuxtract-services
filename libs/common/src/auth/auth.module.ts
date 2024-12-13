import { Module } from '@nestjs/common';
import { Exchanges } from '../constants/exchanges';
import { RmqModule } from '../rmq/rmq.module';

@Module({
  imports: [RmqModule.forRoot({ exchanges: [Exchanges.commands] })],
  exports: [RmqModule],
})
export class AuthModule {}
