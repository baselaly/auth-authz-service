import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from './authorization.controller';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { AuthorizationService } from './authorization.service';

const moduleMocker = new ModuleMocker(global);

describe('AuthorizationController', () => {
  let authorizationController: AuthorizationController;
  let authorizationService: AuthorizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
    })
      .useMocker((token) => {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      })
      .compile();

    authorizationController = module.get<AuthorizationController>(AuthorizationController);
    authorizationService = module.get<AuthorizationService>(AuthorizationService);
  });

  it('should be defined', () => {
    expect(authorizationController).toBeDefined();
  });

  describe('/POST check-action', () => {
    const action = 'create-super-visor';
    const userId = 'f5cb39e6-4ddb-400a-9f71-f0c444d7525e';

    it('should return access with true for the permission', async () => {
      jest.spyOn(authorizationService, 'checkAction').mockResolvedValueOnce(true);

      const data = await authorizationController.checkAction(userId, { action });

      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('status');

      expect(data.data).toHaveProperty('access');

      expect(data.data['access']).toBe(true);
    });

    it('should return access with false for the permission', async () => {
      jest.spyOn(authorizationService, 'checkAction').mockResolvedValueOnce(false);

      const data = await authorizationController.checkAction(userId, { action });

      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('status');

      expect(data.data).toHaveProperty('access');

      expect(data.data['access']).toBe(false);
    });
  });
});
