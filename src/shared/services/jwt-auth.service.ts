import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY });
  }

  async verifyExpiredToken(token: string): Promise<any> {
    return await this.jwtService.verifyAsync(token, { secret: process.env.SECRET_KEY, ignoreExpiration: true });
  }

  async generateToken(payload: object): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
