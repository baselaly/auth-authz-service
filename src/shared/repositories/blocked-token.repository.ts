import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/index.service';
import { Prisma, BlockedToken } from '@prisma/client';
import { DatabaseExceptionFilter } from '../filters/index.filter';
import { ICreate, Ifind } from './interfaces/index.interface';

@Injectable()
export class BlockedTokenRepository implements Ifind<BlockedToken>, ICreate<BlockedToken> {
  constructor(private readonly prisma: PrismaService) {}

  public async find(params: {
    where?: Prisma.BlockedTokenWhereInput;
    select?: Prisma.BlockedTokenSelect;
  }): Promise<Partial<BlockedToken>> {
    try {
      const { select, where } = params;
      return await this.prisma.blockedToken.findFirst({
        select,
        where,
      });
    } catch (err) {
      throw new DatabaseExceptionFilter(err.code, err.message);
    }
  }

  public async create(params: {
    data: Prisma.BlockedTokenCreateInput;
    select?: Prisma.BlockedTokenSelect;
  }): Promise<Partial<BlockedToken>> {
    try {
      const { select, data } = params;
      return await this.prisma.blockedToken.create({
        select,
        data,
      });
    } catch (err) {
      throw new DatabaseExceptionFilter(err.code, err.message);
    }
  }
}
