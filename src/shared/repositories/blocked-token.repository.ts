import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/index.service';
import { Prisma, BlockedToken } from '@prisma/client';
import { DatabaseExceptionFilter } from '../filters/index.filter';
import { ICreate, IDelete, Ifind, IFindAll } from './interfaces/index.interface';

@Injectable()
export class BlockedTokenRepository
  implements Ifind<BlockedToken>, ICreate<BlockedToken>, IFindAll<BlockedToken>, IDelete<BlockedToken>
{
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

  public async findAll(params: {
    select?: Prisma.BlockedTokenSelect;
    skip?: number;
    take?: number;
    cursor?: Prisma.BlockedTokenWhereUniqueInput;
    where?: Prisma.BlockedTokenWhereInput;
    orderBy?: Prisma.BlockedTokenOrderByWithRelationInput;
  }): Promise<Partial<BlockedToken>[]> {
    try {
      const { skip, take, cursor, where, orderBy, select } = params;
      return await this.prisma.blockedToken.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
        select,
      });
    } catch (err) {
      throw new DatabaseExceptionFilter(err.code, err.message);
    }
  }

  async delete(where: Prisma.BlockedTokenWhereUniqueInput): Promise<BlockedToken> {
    try {
      return await this.prisma.blockedToken.delete({
        where,
      });
    } catch (err) {
      throw new DatabaseExceptionFilter(err.code, err.message);
    }
  }
}
