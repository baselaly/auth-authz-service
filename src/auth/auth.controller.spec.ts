import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      })
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('POST /login', () => {
    const loginDto = { email: 'super-admin@test.com', password: '123456' };

    it('should return success class with login data successfully', async () => {
      const result = {
        email: 'super-admin@test.com',
        name: 'super-admin',
        id: 'f5cb39e6-4ddb-400a-9f71-f0c444d7525e',
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyLWFkbWluQHRlc3QuY29tIiwiaWQiOiJmNWNiMzllNi00ZGRiLTQwMGEtOWY3MS1mMGM0NDRkNzUyNWUiLCJuYW1lIjoic3VwZXItYWRtaW4iLCJpYXQiOjE2ODYwMDMyNzAsImV4cCI6MTY4NjAyMTI3MH0.O-SQs3GaDeaZmLa161bfZeIITZlvKi4nWAlaG2W85Uc',
      };

      jest.spyOn(authService, 'login').mockResolvedValueOnce(result);

      const loginData = await authController.login(loginDto);

      expect(loginData.data).toBe(result);
      expect(loginData.message).toBe('Operation Successed');
      expect(loginData.status).toBe(true);
    });

    it('should return wrong credentials', async () => {
      jest.spyOn(authService, 'login').mockImplementationOnce(async () => {
        throw new UnauthorizedException('wrong credentials');
      });

      try {
        loginDto.email = 'super@test.com';
        await authController.login(loginDto);
      } catch (e) {
        expect(e).toHaveProperty('response');

        expect(e.response).toHaveProperty('statusCode');
        expect(e.response.statusCode).toEqual(401);

        expect(e.response).toHaveProperty('message');
        expect(e.response.message).toEqual('wrong credentials');
      }
    });

    it('should return validationError email is required', async () => {
      jest.spyOn(authService, 'login').mockImplementationOnce(async () => {
        throw new BadRequestException({
          message: ['email must be a string', 'email should not be empty'],
        });
      });

      try {
        loginDto.email = '';
        await authController.login(loginDto);
      } catch (e) {
        expect(e).toHaveProperty('response');

        expect(e).toHaveProperty('status');
        expect(e.status).toEqual(400);

        expect(e.response).toHaveProperty('message');
        expect(e.response.message).toEqual(['email must be a string', 'email should not be empty']);
      }
    });

    it('should return validationError password is required', async () => {
      jest.spyOn(authService, 'login').mockImplementationOnce(async () => {
        throw new BadRequestException({
          message: ['password must be a string', 'password should not be empty'],
        });
      });

      try {
        loginDto.password = '';
        await authController.login(loginDto);
      } catch (e) {
        expect(e).toHaveProperty('response');

        expect(e).toHaveProperty('status');
        expect(e.status).toEqual(400);

        expect(e.response).toHaveProperty('message');
        expect(e.response.message).toEqual(['password must be a string', 'password should not be empty']);
      }
    });
  });

  describe('GET /logout', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyLWFkbWluQHRlc3QuY29tIiwiaWQiOiJmNWNiMzllNi00ZGRiLTQwMGEtOWY3MS1mMGM0NDRkNzUyNWUiLCJuYW1lIjoic3VwZXItYWRtaW4iLCJpYXQiOjE2ODYwMDMyNzAsImV4cCI6MTY4NjAyMTI3MH0.O-SQs3GaDeaZmLa161bfZeIITZlvKi4nWAlaG2W85Uc';

    it('should success on logout', async () => {
      jest.spyOn(authService, 'logout').mockImplementationOnce(() => Promise.resolve());

      const data = await authController.logout(token);

      expect(data).toHaveProperty('data');
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('status');

      expect(data.data).toEqual({});
      expect(data.message).toBe('Operation Successed');
      expect(data.status).toBe(true);
    });
  });
});
