import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { GetMeDto } from './dto';

@Injectable()
export class UsersService {
	public constructor(private readonly prismaService: PrismaService) {}

	public getMe(user: User): GetMeDto {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName ?? '',
			lastName: user.lastName ?? '',
			role: user.role
		};
	}

	public async getAllUsers(): Promise<User[]> {
		return this.prismaService.user.findMany();
	}
}
