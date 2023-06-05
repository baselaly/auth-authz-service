import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator((data: string, context: ExecutionContext) => {
  const token: string = context.switchToHttp().getRequest().headers['authorization'];
  return token.split(' ')[1];
});
