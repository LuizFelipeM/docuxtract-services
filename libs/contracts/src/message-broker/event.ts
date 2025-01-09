import { CryptoUtils } from '@libs/common/utils/crypto.utils';
import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';

export class Event<T, K = string> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmptyObject()
  data: T;

  type: K;

  private constructor(data: T, type: K) {
    this.data = data;
    this.type = type;
    this.id = CryptoUtils.generateHash(
      JSON.stringify(data),
      type ? JSON.stringify(type) : '',
    );
  }

  static build<T, K = string>(data: T, type: K): Event<T, K> {
    return new Event(data, type);
  }
}
