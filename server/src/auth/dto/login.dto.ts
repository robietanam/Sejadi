import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  declare email: string;

  @IsNotEmpty()
  declare password: string;

  deviceName?: string;
}
