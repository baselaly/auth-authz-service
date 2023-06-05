import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository, BlockedTokenRepository } from 'src/shared/repositories/index.repository';
import { LoginDto } from './dtos/index.dto';
import { IUser } from './interfaces/index.interface';
import { PasswordService } from './services/index.service';
import { LoginSerializer } from './serializers/login.serialicer';
import { JwtAuthService } from 'src/shared/services/index.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly blockedTokenRepository: BlockedTokenRepository,
  ) {}

  public async login(loginDto: LoginDto): Promise<any> {
    const user: IUser = await this.userRepository.find({
      where: { email: loginDto.email },
      select: {
        email: true,
        name: true,
        id: true,
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('wrong credentials');
    }

    const matchedPassword: boolean = await this.passwordService.comparePassword(loginDto.password, user.password);

    if (!matchedPassword) {
      throw new UnauthorizedException('wrong credentials');
    }

    const token = await this.jwtAuthService.generateToken({ email: user.email, id: user.id, name: user.name });

    return new LoginSerializer(user, token);
  }

  public async logout(token: string): Promise<void> {
    await this.blockedTokenRepository.create({ data: { token } });
  }
}
