import { SaveInboxDto } from '@libs/contracts/email-int';
import { Injectable, Logger } from '@nestjs/common';
import { Inbox } from './entities/inbox.entity';
import { InboxRepository } from './repositories/inbox.repository';

@Injectable()
export class EmailIntService {
  private readonly logger = new Logger(EmailIntService.name);

  constructor(private readonly inboxRepository: InboxRepository) {}

  async saveInbox({
    subject,
    sender,
    receivedDate,
    body,
    attachments,
  }: SaveInboxDto): Promise<Inbox> {
    const inbox = new Inbox();
    inbox.subject = subject;
    inbox.sender = sender;
    inbox.receivedDate = receivedDate;
    inbox.body = body;
    inbox.attachments = attachments;
    await this.inboxRepository.insert(inbox);
    return inbox;
  }

  sendEmail(data: any) {
    this.logger.log('Received data: ', data);
  }
}
