import { AbstractRepository } from '@libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Inbox } from '../entities/inbox.entity';

@Injectable()
export class InboxRepository extends AbstractRepository<Inbox> {
  protected readonly logger = new Logger(InboxRepository.name);

  constructor(dataSource: DataSource) {
    super(dataSource.getRepository<Inbox>(Inbox));
  }
}
