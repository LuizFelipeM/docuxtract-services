import { Exchanges, RmqModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [RmqModule.forRoot({ exchanges: [Exchanges.commands] })],
  controllers: [AuthController],
  providers: [AuthController, AuthService],
})
export class AuthModule {}
