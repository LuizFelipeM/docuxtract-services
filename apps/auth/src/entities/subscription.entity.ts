import { AbstractEntity } from '@libs/common';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'subscription' })
export class Subscription extends AbstractEntity {
  @Column({ name: 'type' })
  type: string;

  @Column({ name: 'expire_at' })
  expireAt: Date;
}
