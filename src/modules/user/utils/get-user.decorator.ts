import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Get user
 */
const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  return request.user;
});

export { GetUser };
