import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { CreateUserDto, GetMeDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async create(dto: CreateUserDto): Promise<User> {
		const { email, password, role, ...rest } = dto;

		const existingUser = await this.prismaService.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			throw new ConflictException('User with this email already exists');
		}

		const hashedPassword = await hash(password);

		return this.prismaService.user.create({
			data: {
				...rest,
				email,
				password: hashedPassword,
				role: role || 'STUDENT' // Use provided role or default to STUDENT
			}
		});
	}

	public async update(id: string, dto: UpdateUserDto): Promise<User> {
		return this.prismaService.user.update({
			where: { id },
			data: dto
		});
	}

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

	public async updateMe(id: string, dto: UpdateUserDto): Promise<User> {
		if (dto.password) {
			dto.password = await hash(dto.password);
		}
		return this.prismaService.user.update({
			where: { id },
			data: dto
		});
	}
}
