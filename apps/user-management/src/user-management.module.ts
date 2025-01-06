import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { WebhooksController } from './webhooks/webhooks.controller';
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [AuthModule, PermissionModule],
  controllers: [HealthcheckController, WebhooksController],
  providers: [],
})
export class UserManagementModule {}
