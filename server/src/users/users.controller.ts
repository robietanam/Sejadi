import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    const u = await this.usersService.findById(id);
    return { id: u._id, email: u.email };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async profile(@Req() req: any) {
    const userId = req.user.sub;
    const u = await this.usersService.findById(userId);
    return { id: u._id, email: u.email };
  }
}
