import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';

export enum SubscriptionStatus {
  active = 'active',
  canceled = 'canceled',
  incomplete = 'incomplete',
  incomplete_expired = 'incomplete_expired',
  pastDue = 'past_due',
  paused = 'paused',
  trialing = 'trialing',
  unpaid = 'unpaid',
}

export class SubscribedCustomerDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SubscribedUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class CustomerSubscriptionCreatedDto {
  @IsNotEmptyObject()
  customer: SubscribedCustomerDto;

  @IsNotEmptyObject()
  user: SubscribedUserDto;

  @IsNotEmpty()
  status: SubscriptionStatus;

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;
}
