import { Module } from '@nestjs/common';
import { RmqModule } from '../rmq/rmq.module';
import { Exchange } from '@libs/contracts';

@Module({
  imports: [RmqModule.forRoot({ exchanges: [Exchange.Commands] })],
  exports: [RmqModule],
})
export class AuthModule {}
