import {
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateIf,
} from 'class-validator';

export class RPCMessage<T> {
  @IsNotEmpty()
  success: boolean;

  @ValidateIf((o) => !o.isSuccess)
  @IsInstance(Error)
  error?: Error;

  @ValidateIf((o) => o.isSuccess)
  @IsNotEmptyObject()
  data?: T;

  private constructor(success: boolean, error?: Error, data?: T) {
    this.success = success;
    this.error = error;
    this.data = data;
  }

  static build<K>(error: Error): RPCMessage<K>;
  static build<K>(data: K): RPCMessage<K>;
  static build<K>(data: K | Error): RPCMessage<K> {
    const isError = data instanceof Error;
    return new RPCMessage<K>(
      !isError,
      isError ? data : undefined,
      !isError ? data : undefined,
    );
  }
}
