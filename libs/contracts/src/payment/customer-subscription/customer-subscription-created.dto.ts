import {
  IsArray,
  IsDate,
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

  email?: string;
}

export class CustomerSubscriptionCreatedDto {
  @IsNotEmptyObject()
  customer: SubscribedCustomerDto;

  @IsArray()
  @IsNotEmpty()
  claims: string[];

  @IsNotEmpty()
  status: SubscriptionStatus;

  @IsDate()
  @IsNotEmpty()
  expiresAt: Date;
}
