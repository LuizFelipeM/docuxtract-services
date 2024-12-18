import { IsJWT, IsNotEmpty } from 'class-validator';

export class AuthVerifyDto {
  @IsJWT()
  @IsNotEmpty()
  authorization: string;
}
