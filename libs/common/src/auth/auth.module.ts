import { Module } from '@nestjs/common';
import { RmqModule } from '../rmq/rmq.module';
import { Services } from '@libs/contracts';

@Module({
  imports: [RmqModule.register({ name: Services.Auth })],
  exports: [RmqModule],
})
export class AuthModule {}
