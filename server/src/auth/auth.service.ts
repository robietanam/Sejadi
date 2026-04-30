import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private sessionsService: SessionsService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) return user;
    return null;
  }

  async login(user: any, deviceName?: string, ip?: string, deviceId?: string) {
    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const session = await this.sessionsService.create(user._id.toString(), {
      deviceId,
      deviceName: deviceName ?? 'unknown',
      ip: ip ?? 'unknown',
      accessTokenExp: Date.now() + 60 * 60 * 1000,
      refreshTokenExp: Date.now() + 7 * 24 * 60 * 60 * 1000,
      refreshToken,
    });

    // Return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      expiresIn: 3600,
      sessionId: session._id.toString(),
    };
  }

  async refresh(userId: string, refreshToken: string) {
    const session = await this.sessionsService.findByRefreshToken(refreshToken);
    if (!session || session.user.toString() !== userId)
      throw new UnauthorizedException();

    const user = await this.usersService.findById(userId);
    const payload = { sub: userId, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // Update session with new refresh token
    await this.sessionsService.updateRefreshToken(
      session._id.toString(),
      newRefreshToken,
    );

    console.log('[Auth] Token refreshed for user:', userId);
    return { accessToken, refreshToken: newRefreshToken, expiresIn: 3600 };
  }

  async register(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    return { id: user._id.toString(), email: user.email };
  }
}
