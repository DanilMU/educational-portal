import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { RegisterDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: string;
	private readonly JWT_REFRESH_TOKEN_TTL: string;

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>(
			'JWT_ACCESS_TOKEN_TTL'
		);

		this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>(
			'JWT_REFRESH_TOKEN_TTL'
		);
	}

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

		return this.generateTokens(user);
	}

	private async generateTokens(user: User) {
		const payload: JwtPayload = {
			sub: user.id,
			role: user.role
		};

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		} as any);

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		} as any);

		return {
			accessToken,
			refreshToken
		};
	}
}
