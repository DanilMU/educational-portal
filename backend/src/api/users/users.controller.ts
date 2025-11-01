import { Controller, Get } from '@nestjs/common';
import { User } from '@prisma/client';
import { Authorized, Protected } from 'src/common/decorators';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Protected()
	@Get('@me')
	public getMe(@Authorized() user: User) {
		return user;
	}
}
