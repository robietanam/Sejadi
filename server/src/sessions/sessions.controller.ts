import {
  Controller,
  Get,
  UseGuards,
  Req,
  Delete,
  Param,
  Post,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req: any) {
    const userId = req.user.sub;
    const sessions = await this.sessionsService.findByUser(userId);
    return sessions.map((s) => ({
      id: s._id.toString(),
      deviceId: (s as any).deviceId,
      deviceName: s.deviceName,
      ip: s.ip,
      createdAt: (s as any).createdAt,
      accessTokenExp: s.accessTokenExp,
      refreshTokenExp: s.refreshTokenExp,
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async revoke(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    const session = await this.sessionsService.findById(id);
    if (session.user.toString() !== userId)
      throw new ForbiddenException('Not allowed');
    await this.sessionsService.revoke(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('device/:deviceId')
  async revokeByDevice(@Req() req: any, @Param('deviceId') deviceId: string) {
    const userId = req.user.sub;
    await this.sessionsService.revokeByDevice(userId, deviceId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-all')
  async revokeAll(@Req() req: any) {
    const userId = req.user.sub;
    await this.sessionsService.revokeAll(userId);
    return { success: true };
  }
}
