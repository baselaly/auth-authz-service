import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/index.service';
import { Prisma, User } from '@prisma/client';
import { DatabaseExceptionFilter } from '../filters/index.filter';
import { Ifind } from './interfaces/index.interface';

@Injectable()
export class UserRepository implements Ifind<User> {
  constructor(private readonly prisma: PrismaService) {}

  public async find(params: { where?: Prisma.UserWhereInput; select?: Prisma.UserSelect }): Promise<Partial<User>> {
    try {
      const { select, where } = params;
      return await this.prisma.user.findFirst({
        select,
        where,
      });
    } catch (err) {
      throw new DatabaseExceptionFilter(err.code, err.message);
    }
  }
}
