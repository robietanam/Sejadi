import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async get(@Param('id') id: string): Promise<UserDto> {
    const u = await this.usersService.findById(id);
    const { password, ...userWithoutPassword } = u.toObject();
    return {
      _id: u._id.toString(),
      email: userWithoutPassword.email,
      devices: userWithoutPassword.devices,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async profile(@Req() req: any): Promise<UserDto> {
    const userId = req.user.sub;
    const u = await this.usersService.findById(userId);
    const { password, ...userWithoutPassword } = u.toObject();
    return {
      _id: u._id.toString(),
      email: userWithoutPassword.email,
      devices: userWithoutPassword.devices,
    };
  }
}
