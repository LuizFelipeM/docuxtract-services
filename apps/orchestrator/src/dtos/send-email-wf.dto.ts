import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailWf {
  @IsString()
  @IsNotEmpty()
  sender: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsNotEmpty()
  receipient: string;

  @IsArray()
  attachments?: string[];
}
