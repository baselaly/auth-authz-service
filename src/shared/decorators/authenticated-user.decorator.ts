import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthenticatedUser = createParamDecorator((data: string, context: ExecutionContext) => {
  const user = context.switchToHttp().getRequest().user;
  return data && user ? user[data] : user;
});
