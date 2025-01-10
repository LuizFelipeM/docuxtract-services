import { IsDate, IsInstance, IsNotEmpty } from 'class-validator';
import { CustomerDto } from './customer.dto';
import { SubscriptionStatus } from './subscription-status';
import { UserDto } from './user.dto';

export class CustomerSubscriptionCreatedDto {
  @IsInstance(CustomerDto)
  customer: CustomerDto;

  @IsInstance(UserDto)
  user: UserDto;

  @IsNotEmpty()
  status: SubscriptionStatus;

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;
}
