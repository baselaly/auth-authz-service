import { Global, Module } from '@nestjs/common';
import { UserRepository, BlockedTokenRepository, PermissionRepository } from './repositories/index.repository';
import { CacheService, JwtAuthService, PrismaService } from './services/index.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: Number(configService.get('CACHE_TTL')),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: { algorithm: 'HS256', expiresIn: configService.get('TOKEN_EXPIREDIN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    UserRepository,
    PrismaService,
    BlockedTokenRepository,
    JwtAuthService,
    PermissionRepository,
    CacheService,
  ],
  exports: [UserRepository, BlockedTokenRepository, JwtAuthService, PermissionRepository, CacheService],
})
export class SharedModule {}
