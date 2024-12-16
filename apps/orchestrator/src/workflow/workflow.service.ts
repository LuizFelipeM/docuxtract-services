import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Saga } from './saga';

@Injectable()
export class WorkflowService {
  private _saga: Type<Saga<unknown, unknown>>;

  constructor(private readonly moduleRef: ModuleRef) {}

  get saga() {
    return this._saga;
  }

  setSaga<T, R>(saga: Type<Saga<T, R>>) {
    this._saga = saga;
  }

  async execute<T>(params: T): Promise<void> {
    const sagaInstance = await this.moduleRef.resolve(this._saga);
    if (!sagaInstance) throw new Error(`Saga ${this._saga.name} not found.`);
    await sagaInstance.execute(params);
  }
}
