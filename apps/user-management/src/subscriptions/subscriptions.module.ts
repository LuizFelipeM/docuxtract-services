import { AuthModule, Exchanges, RmqModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [
    RmqModule.forRoot({ exchanges: [Exchanges.events] }),
    AuthModule,
    OrganizationsModule,
    PermissionsModule,
  ],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class SubscriptionsModule {}
