import { CryptoUtils } from '@libs/common/utils/crypto.utils';
import {
  IsInstance,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CommandRequest<T, K = string> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  type: K;

  @IsNotEmpty()
  data: T;

  constructor(type: K, data: T) {
    this.type = type;
    this.data = data;
    this.id = CryptoUtils.generateHash(
      JSON.stringify(type),
      JSON.stringify(data),
    );
  }

  response<K>(error: Error): CommandResponse<K>;
  response<K>(data: K): CommandResponse<K>;
  response<K>(data: K | Error): CommandResponse<K> {
    const isError = data instanceof Error;
    return new CommandResponse<K>(
      this.id,
      !isError,
      isError ? data : undefined,
      !isError ? data : undefined,
    );
  }
}

export class CommandResponse<T> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  success: boolean;

  @ValidateIf((o) => !o.isSuccess)
  @IsInstance(Error)
  error?: Error;

  @ValidateIf((o) => o.isSuccess)
  @IsNotEmptyObject()
  data?: T;

  constructor(id: string, success: boolean, error?: Error, data?: T) {
    this.id = id;
    this.success = success;
    this.error = error;
    this.data = data;
  }
}

export class Command {
  static build<T, K = string>(type: K, data: T): CommandRequest<T, K> {
    return new CommandRequest(type, data);
  }
}
