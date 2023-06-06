import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BlockedTokenRepository } from 'src/shared/repositories/index.repository';
import { JwtAuthService } from 'src/shared/services/index.service';

@Injectable()
export class CronjobService {
  constructor(
    private readonly blockedTokenRepository: BlockedTokenRepository,
    private readonly jwtAuthService: JwtAuthService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  public async deleteExpiredBlockedTokens() {
    const blockedTokens = await this.blockedTokenRepository.findAll({ select: { id: true, token: true } });

    Promise.all(
      blockedTokens.map(async (blockedToken) => {
        try {
          await this.jwtAuthService.verifyToken(blockedToken.token);
        } catch (err) {
          await this.blockedTokenRepository.delete({ id: blockedToken.id });
        }
      }),
    );
  }
}
