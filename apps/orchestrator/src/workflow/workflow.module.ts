import { Exchanges, RmqModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { SendEmailSaga } from './sagas/send-email.saga';
import { SaveInboxStep } from './steps/save-inbox.step';
import { SendEmaiStep } from './steps/send-email.step';
import { WorkflowService } from './workflow.service';

@Module({
  imports: [
    RmqModule.forRoot({ exchanges: [Exchanges.commands, Exchanges.events] }),
  ],
  exports: [WorkflowService],
  providers: [SaveInboxStep, SendEmaiStep, SendEmailSaga, WorkflowService],
})
export class WorkflowModule {}
