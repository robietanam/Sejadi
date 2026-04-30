import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[A-Z])/, {
    message: 'password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'password must contain at least one number' })
  @Matches(/(?=.*[!@#$%^&*])/, {
    message: 'password must contain at least one special character',
  })
  password: string;
}
