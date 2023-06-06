import { Injectable } from '@nestjs/common';
import { CheckActionDto } from './dtos/index.dto';
import { PermissionRepository, UserRepository } from '../shared/repositories/index.repository';
import { CacheService } from '../shared/services/index.service';

@Injectable()
export class AuthorizationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly cacheService: CacheService,
  ) {}

  public async checkAction(checkActionDto: CheckActionDto, userId: string): Promise<boolean> {
    let userPermissions = await this.cacheService.get(`user.${userId}.permissions`);

    if (!userPermissions) {
      // get user roles
      const user = await this.userRepository.find({
        where: { id: userId },
        select: {
          userRoles: {
            select: {
              roleId: true,
            },
          },
        },
      });

      const userRoleIds = user['userRoles'].map((userRole) => userRole.roleId);

      // get roles permissions
      userPermissions = await this.permissionRepository.findAll({
        where: {
          rolePermissions: {
            some: {
              roleId: { in: userRoleIds },
            },
          },
        },
        select: { id: true, name: true },
      });

      // caching user permissions
      await this.cacheService.set(`user.${userId}.permissions`, userPermissions);
    } else {
      console.log('cached permissions', userPermissions);
    }

    return userPermissions.find((permission) => permission.name === checkActionDto.action) ? true : false;
  }
}
