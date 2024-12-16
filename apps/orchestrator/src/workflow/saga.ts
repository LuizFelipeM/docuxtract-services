import { Logger } from '@nestjs/common';
import { Step } from './step';

export abstract class Saga<T, R> {
  private readonly logger = new Logger(Saga.name);

  protected successfulSteps: Step<T, R>[] = [];

  constructor(protected readonly steps: Step<T, R>[]) {}

  async execute(params: T): Promise<void> {
    for (const step of this.steps) {
      try {
        this.logger.log(`Current step: ${step.name}`);
        await step.invoke(params);
        this.successfulSteps.unshift(step);
      } catch (error) {
        this.logger.error(`Failed step: ${step.name} with error:`);
        this.logger.error(error);
        await this.rollback(params);
        throw error;
      }
    }
  }

  private async rollback(params: T): Promise<void> {
    this.logger.log('Starting rollback...');
    for (const step of this.successfulSteps) {
      this.logger.log(`Current rollbacking step: ${step.name}`);
      await step.withCompensation(params);
    }
  }
}
