import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PasswordService } from './services/index.service';
import { JwtAuthService, PrismaService } from '../shared/services/index.service';
import { UserRepository, BlockedTokenRepository } from '../shared/repositories/index.repository';
import { JwtService } from '@nestjs/jwt';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let passwordService: PasswordService;
  let jwtAuthService: JwtAuthService;
  let blockedTokenRepository: BlockedTokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PasswordService, JwtAuthService, UserRepository, BlockedTokenRepository],
    })
      .useMocker((token) => {
        if (token === JwtService || token === PrismaService) {
          const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        } else {
          return token;
        }
      })
      .compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    passwordService = module.get<PasswordService>(PasswordService);
    jwtAuthService = module.get<JwtAuthService>(JwtAuthService);
    blockedTokenRepository = module.get<BlockedTokenRepository>(BlockedTokenRepository);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('login', () => {
    const loginDto = { email: 'super-admin@test.com', password: '123456' };

    const user = {
      email: 'super-admin@test.com',
      name: 'super-admin',
      id: 'f5cb39e6-4ddb-400a-9f71-f0c444d7525e',
    };

    it('should return login data', async () => {
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyLWFkbWluQHRlc3QuY29tIiwiaWQiOiJmNWNiMzllNi00ZGRiLTQwMGEtOWY3MS1mMGM0NDRkNzUyNWUiLCJuYW1lIjoic3VwZXItYWRtaW4iLCJpYXQiOjE2ODYwMDMyNzAsImV4cCI6MTY4NjAyMTI3MH0.O-SQs3GaDeaZmLa161bfZeIITZlvKi4nWAlaG2W85Uc';

      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(user);

      jest.spyOn(passwordService, 'comparePassword').mockResolvedValueOnce(true);

      jest.spyOn(jwtAuthService, 'generateToken').mockResolvedValueOnce(token);

      const data = await authService.login(loginDto);

      expect(data).toHaveProperty('email');
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('name');
      expect(data).toHaveProperty('id');

      expect(data.token).toEqual(token);
    });

    it('should return UnAuthenticated user not found with that email', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(null);

      try {
        await authService.login(loginDto);
      } catch (e) {
        expect(e).toHaveProperty('response');

        expect(e.response).toHaveProperty('statusCode');
        expect(e.response.statusCode).toBe(401);

        expect(e.response).toHaveProperty('message');
        expect(e.response.message).toEqual('wrong credentials');
      }
    });

    it('should return UnAuthenticated for password not matched', async () => {
      jest.spyOn(userRepository, 'find').mockResolvedValueOnce(user);

      jest.spyOn(passwordService, 'comparePassword').mockResolvedValueOnce(false);

      try {
        await authService.login(loginDto);
      } catch (e) {
        expect(e).toHaveProperty('response');

        expect(e.response).toHaveProperty('statusCode');
        expect(e.response.statusCode).toBe(401);

        expect(e.response).toHaveProperty('message');
        expect(e.response.message).toEqual('wrong credentials');
      }
    });
  });

  describe('logout', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InN1cGVyLWFkbWluQHRlc3QuY29tIiwiaWQiOiJmNWNiMzllNi00ZGRiLTQwMGEtOWY3MS1mMGM0NDRkNzUyNWUiLCJuYW1lIjoic3VwZXItYWRtaW4iLCJpYXQiOjE2ODYwMDMyNzAsImV4cCI6MTY4NjAyMTI3MH0.O-SQs3GaDeaZmLa161bfZeIITZlvKi4nWAlaG2W85Uc';

    it('should return void in logout success', async () => {
      jest.spyOn(blockedTokenRepository, 'create').mockResolvedValueOnce({ token });
      const data = await authService.logout(token);
      expect(data).toBeUndefined();
    });
  });
});
