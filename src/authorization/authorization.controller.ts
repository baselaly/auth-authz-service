import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthorizationService } from './authorization.service';
import { SuccessClass } from 'src/shared/classes/success.class';
import { AuthenticatedUser } from 'src/shared/decorators/authenticated-user.decorator';
import { CheckActionDto } from './dtos/index.dto';
import { AuthGuard } from 'src/shared/guards/index.guard';

@Controller('authorization')
export class AuthorizationController {
  constructor(private readonly authorizationService: AuthorizationService) {}

  @Post('/check-action')
  @UseGuards(AuthGuard)
  public async checkAction(
    @AuthenticatedUser('id') userId: string,
    @Body() checkActionDto: CheckActionDto,
  ): Promise<SuccessClass> {
    const access = await this.authorizationService.checkAction(checkActionDto, userId);
    return new SuccessClass({ access });
  }
}
