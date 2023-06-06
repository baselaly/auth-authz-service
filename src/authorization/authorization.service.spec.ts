import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { PermissionRepository, UserRepository } from '../shared/repositories/index.repository';
import { User } from '@prisma/client';

const moduleMocker = new ModuleMocker(global);

describe('AuthorizationService', () => {
  let authorizationService: AuthorizationService;
  let userRepository: UserRepository;
  let permissionRepository: PermissionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorizationService, UserRepository, PermissionRepository],
    })
      .useMocker((token) => {
        if (token === UserRepository || token === PermissionRepository) {
          return token;
        } else {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authorizationService = module.get<AuthorizationService>(AuthorizationService);
    permissionRepository = module.get<PermissionRepository>(PermissionRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(authorizationService).toBeDefined();
  });

  describe('checkAction', () => {
    const userId = 'f5cb39e6-4ddb-400a-9f71-f0c444d7525e';
    const roleId = '247010ee-409f-4f01-a172-34571fcd85db';
    const action = 'create-super-visor';
    const permissions = [{ id: '141974ff-c44c-461a-9278-46a245b4c527', name: 'create-super-visor' }];

    it('should return access equal true to permission', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce({ userRoles: [{ roleId, userId }] } as Partial<User>);

      jest.spyOn(permissionRepository, 'findAll').mockResolvedValueOnce(permissions);

      const access = await authorizationService.checkAction({ action }, userId);

      expect(access).toBe(true);
    });

    it('should return access equal false to permission', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce({ userRoles: [{ roleId, userId }] } as Partial<User>);

      jest.spyOn(permissionRepository, 'findAll').mockResolvedValueOnce(permissions);

      const access = await authorizationService.checkAction({ action: 'create-employee' }, userId);

      expect(access).toBe(false);
    });

    it('should return access equal false for user has no role', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce({ userRoles: [] } as Partial<User>);

      jest.spyOn(permissionRepository, 'findAll').mockResolvedValueOnce([]);

      const access = await authorizationService.checkAction({ action }, userId);

      expect(access).toBe(false);
    });

    it('should return access equal false for user has roles but role has no permissions attached', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce({ userRoles: [{ roleId, userId }] } as Partial<User>);

      jest.spyOn(permissionRepository, 'findAll').mockResolvedValueOnce([]);

      const access = await authorizationService.checkAction({ action }, userId);

      expect(access).toBe(false);
    });
  });
});
