import {
  Body,
  Controller,
  Post,
  Req,
  Get,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RefreshResponseDto } from './dto/refresh-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { SessionsService } from '../sessions/sessions.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionsService: SessionsService,
  ) {}

  @Throttle({ default: { limit: 5 } })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: any,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    return this.authService.login(user, dto.deviceName, ip, dto.deviceId);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('refresh')
  async refresh(@Body() body: any): Promise<RefreshResponseDto> {
    const { refreshToken } = body;
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');
    const session = await this.sessionsService.findByRefreshToken(refreshToken);
    if (!session) throw new UnauthorizedException('Invalid refresh token');
    const userId = session.user.toString();
    return this.authService.refresh(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Body() body: any) {
    const userId = req.user.sub;
    const deviceId = body?.deviceId;
    console.log('[Auth] logout called user:', userId, 'deviceId:', deviceId);
    if (deviceId) {
      await this.sessionsService.revokeByDevice(userId, deviceId);
      return { success: true };
    }
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return { id: req.user.sub, email: req.user.email };
  }
}
