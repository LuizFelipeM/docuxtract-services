import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CrmIntService {
  private readonly logger = new Logger(CrmIntService.name);

  log(data: unknown): void {
    this.logger.log(data);
  }
}
