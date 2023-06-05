import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthService } from '../services/index.service';
import { BlockedTokenRepository } from '../repositories/index.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtAuthService: JwtAuthService,
    private readonly blockedTokenRepository: BlockedTokenRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let token: string = context.switchToHttp().getRequest().headers['authorization'];
    const request = context.switchToHttp().getRequest();
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
      try {
        const result = await this.jwtAuthService.verifyToken(token);

        const blockedToken = await this.blockedTokenRepository.find({
          where: { token },
          select: {
            id: true,
          },
        });

        if (blockedToken) {
          throw new UnauthorizedException();
        }

        request.user = result;
        return true;
      } catch (err) {
        throw new UnauthorizedException({ message: 'UNAUTHENTICATED' });
      }
    } else {
      throw new UnauthorizedException({ message: 'UNAUTHENTICATED' });
    }
  }
}
