import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  declare email: string;

  @IsNotEmpty()
  declare password: string;
}
