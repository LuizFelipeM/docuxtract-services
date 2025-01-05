import { CryptoUtils } from '@libs/common/utils/crypto.utils';
import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';

export class Event<T, K = string> {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  type: K;

  @IsNotEmptyObject()
  data: T;

  private constructor(type: K, data: T) {
    this.type = type;
    this.data = data;
    this.id = CryptoUtils.generateHash(
      JSON.stringify(type),
      JSON.stringify(data),
    );
  }

  static build<T, K = string>(type: K, data: T): Event<T, K> {
    return new Event(type, data);
  }
}
