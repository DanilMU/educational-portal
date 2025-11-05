import {
	Body,
	Controller,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Role, User } from '@prisma/client';
import { Authorized, Protected, Roles } from 'src/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

import { CreateUserDto, GetMeDto, UpdateUserDto } from './dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	public constructor(private readonly usersService: UsersService) {}

	@Post()
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiOkResponse({ type: GetMeDto })
	public async create(@Body() dto: CreateUserDto): Promise<User> {
		return this.usersService.create(dto);
	}

	@Patch(':id')
	@Roles(Role.ADMIN)
	@UseGuards(JwtAuthGuard, RolesGuard)
	@ApiOkResponse({ type: GetMeDto })
	public async update(
		@Param('id') id: string,
		@Body() dto: UpdateUserDto
	): Promise<User> {
		return this.usersService.update(id, dto);
	}

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
