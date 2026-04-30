import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      console.log(
        '[JWT Guard] Auth failed -',
        err?.message || info?.message || 'No user',
      );
      throw err || new UnauthorizedException();
    }
    console.log('[JWT Guard] Auth passed for user:', user.sub);
    return user;
  }
}
