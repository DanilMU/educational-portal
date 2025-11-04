import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Authorized, Protected } from 'src/common/decorators';

import { GetMeDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Protected()
	@Get('@me')
	@ApiOkResponse({ type: GetMeDto })
	public getMe(@Authorized() user: User): GetMeDto {
		return this.usersService.getMe(user);
	}
}
