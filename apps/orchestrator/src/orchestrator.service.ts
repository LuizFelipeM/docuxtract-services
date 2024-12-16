import { Injectable } from '@nestjs/common';
import { SendEmailWf } from './dtos/send-email-wf.dto';
import { SendEmailSaga } from './workflow/sagas/send-email.saga';
import { WorkflowService } from './workflow/workflow.service';

@Injectable()
export class OrchestratorService {
  constructor(private readonly workflowService: WorkflowService) {
    this.workflowService.setSaga(SendEmailSaga);
  }

  async executeSaga(request: SendEmailWf) {
    await this.workflowService.execute(request);
  }
}
