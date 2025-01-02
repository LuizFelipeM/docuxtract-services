import { AbstractEntity } from '@libs/common';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity({ name: 'user' })
export class User extends AbstractEntity {
  /**
   * Direct reference to Clerk User ID
   */
  @PrimaryColumn({ name: 'id' })
  id: string;

  @OneToOne(() => Subscription)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;
}
