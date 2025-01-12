import { IsDate, IsInstance, ValidateIf } from 'class-validator';
import { CustomerDto } from './customer.dto';
import { SubscriptionStatus } from './subscription-status';
import { UserDto } from './user.dto';

export class SubscriptionUpdatedDto {
  @ValidateIf((o) => !o.customer)
  @IsInstance(UserDto)
  user: UserDto;

  @ValidateIf((o) => !o.user)
  @IsInstance(CustomerDto)
  customer: CustomerDto;

  status?: SubscriptionStatus;

  @IsDate()
  expiresAt?: Date;
}
