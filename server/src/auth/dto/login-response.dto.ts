import { UserDto } from '../../users/dto/user.dto';

export class LoginResponseDto {
  declare user: UserDto;
  declare accessToken: string;
  declare refreshToken: string;
  declare expiresIn: number;
}
