import { AbstractEntity } from '@libs/common';
import { Column, Entity } from 'typeorm';

export class Attachement {
  key: string;
  name: string;
  extension: string;
}

@Entity({ name: 'inbox' })
export class Inbox extends AbstractEntity {
  @Column({ name: 'received_date' })
  receivedDate: Date;

  @Column({ name: 'sender' })
  sender: string;

  @Column({ name: 'subject' })
  subject: string;

  @Column({ name: 'body' })
  body: string;

  @Column({ name: 'attachments', type: 'json' })
  attachments: Attachement[];
}
