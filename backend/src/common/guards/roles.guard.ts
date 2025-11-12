import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, User } from '@prisma/client';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
	user: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
	public constructor(private readonly reflector: Reflector) {}

	public canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
			'roles',
			[context.getHandler(), context.getClass()]
		);

		if (!requiredRoles) {
			return true;
		}

		const { user } = context
			.switchToHttp()
			.getRequest<AuthenticatedRequest>();

		console.log('ROLES_GUARD: Required roles:', requiredRoles);
		console.log('ROLES_GUARD: User from request:', user);
		console.log("ROLES_GUARD: User's role:", user?.role);

		const hasRole = requiredRoles.some(role => user?.role === role);

		console.log('ROLES_GUARD: Has required role:', hasRole);

		return hasRole;
	}
}
