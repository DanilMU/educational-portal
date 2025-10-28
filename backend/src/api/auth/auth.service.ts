import { ConflictException, Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
	public constructor(private readonly prismaService: PrismaService) {}

	public async register(dto: RegisterDto) {
		const { firstName, lastName, email, password } = dto;

		const exists = await this.prismaService.user.findUnique({
			where: {
				email
			}
		});

		if (exists)
			throw new ConflictException(
				'Пользователь с такой почтой уже существует'
			);

		const hashedPassword = await hash(password);

		const user = await this.prismaService.user.create({
			data: {
				firstName,
				lastName,
				email,
				password: hashedPassword
			}
		});

		return user;
	}
}
