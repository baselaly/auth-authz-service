import { Injectable } from '@nestjs/common';
import { PrismaService } from '../services/index.service';
import { Prisma, Permission } from '@prisma/client';
import { DatabaseExceptionFilter } from '../filters/index.filter';
import { Ifind, IFindAll } from './interfaces/index.interface';

@Injectable()
export class PermissionRepository implements Ifind<Permission>, IFindAll<Permission> {
  constructor(private readonly prisma: PrismaService) {}

  public async find(params: {
    where?: Prisma.PermissionWhereInput;
    select?: Prisma.PermissionSelect;
  }): Promise<Partial<Permission>> {
    try {
      const { select, where } = params;
      return await this.prisma.permission.findFirst({
        select,
        where,
      });
    } catch (err) {
      throw new DatabaseExceptionFilter(err.code, err.message);
    }
  }

  public async findAll(params: {
    select?: Prisma.PermissionSelect;
    skip?: number;
    take?: number;
    cursor?: Prisma.PermissionWhereUniqueInput;
    where?: Prisma.PermissionWhereInput;
    orderBy?: Prisma.PermissionOrderByWithRelationInput;
  }): Promise<Partial<Permission>[]> {
    try {
      const { skip, take, cursor, where, orderBy, select } = params;
      return await this.prisma.permission.findMany({
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
}
