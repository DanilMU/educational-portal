import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '@prisma/client';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
	user: User;
}

export const Authorized = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

		const user = request.user;

		return data ? user[data] : user;
	}
);
