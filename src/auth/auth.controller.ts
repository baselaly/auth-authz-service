import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { SuccessClass } from 'src/shared/classes/success.class';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { AuthToken } from './decorators/auth-token.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  public async login(@Body() loginDto: LoginDto): Promise<SuccessClass> {
    const data = await this.authService.login(loginDto);
    return new SuccessClass(data);
  }

  @Get('/logout')
  @UseGuards(AuthGuard)
  public async logout(@AuthToken() token: string): Promise<SuccessClass> {
    await this.authService.logout(token);
    return new SuccessClass();
  }
}
