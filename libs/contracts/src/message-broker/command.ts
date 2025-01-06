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

  static build<TData, KType = string>(
    type: KType,
    data: TData,
  ): CommandRequest<TData, KType> {
    const request = new CommandRequest<TData, KType>();
    request.type = type;
    request.data = data;
    request.id = CryptoUtils.generateHash(
      JSON.stringify(type),
      JSON.stringify(data),
    );
    return request;
  }

  response<R>(error: Error): CommandResponse<R>;
  response<R>(data: R): CommandResponse<R>;
  response<R>(data: R | Error): CommandResponse<R> {
    const isError = data instanceof Error;
    return CommandResponse.build(
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

  static build<TData>(
    id: string,
    success: boolean,
    error?: Error,
    data?: TData,
  ) {
    const response = new CommandResponse<TData>();
    response.id = id;
    response.success = success;
    response.error = error;
    response.data = data;
    return response;
  }
}

export class Command {
  static build<T, K = string>(type: K, data: T): CommandRequest<T, K> {
    return CommandRequest.build(type, data);
  }
}
