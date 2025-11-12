import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
	user: User;
}

export const GetUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
		return request.user;
	}
);
