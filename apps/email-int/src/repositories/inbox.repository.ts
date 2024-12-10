import { AbstractRepostiroy } from '@libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { Inbox } from '../entities/inbox.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InboxRepository extends AbstractRepostiroy<Inbox> {
  protected readonly logger = new Logger('InboxRepository');

  constructor(
    @InjectRepository(InboxRepository)
    private inboxRepository: Repository<Inbox>,
  ) {
    super(inboxRepository);
  }
}
