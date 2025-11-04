import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Authorized, Protected, Roles } from 'src/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

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

	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Get()
	@ApiOkResponse({ type: [GetMeDto] })
	public async getAllUsers(): Promise<User[]> {
		return this.usersService.getAllUsers();
	}
}
