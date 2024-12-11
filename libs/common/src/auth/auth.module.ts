import { Module } from '@nestjs/common';
import { RmqModule } from '../rmq/rmq.module';
import { Exchanges } from '@libs/contracts';

@Module({
  imports: [RmqModule.forRoot({ exchanges: [Exchanges.commands] })],
  exports: [RmqModule],
})
export class AuthModule {}
