import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { ms, StringValue } from 'src/common/utils';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { LoginDto, RegisterDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue;

	public constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService
	) {
		this.JWT_ACCESS_TOKEN_TTL = configService.getOrThrow<StringValue>(
			'JWT_ACCESS_TOKEN_TTL'
		);

		this.JWT_REFRESH_TOKEN_TTL = configService.getOrThrow<StringValue>(
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

	public async login(dto: LoginDto) {
		const { email, password } = dto;

		const user = await this.prismaService.user.findUnique({
			where: {
				email
			}
		});

		if (!user) throw new NotFoundException('Неверный логин или пароль');

		const isValidPassword = await verify(user.password, password);

		if (!isValidPassword)
			throw new NotFoundException('Неверный логин или пароль');

		return this.generateTokens(user);
	}

	private async generateTokens(user: User) {
		const payload: JwtPayload = {
			id: user.id,
			role: user.role
		};

		const refreshTokenExpires = new Date(
			Date.now() + ms(this.JWT_REFRESH_TOKEN_TTL)
		);

		const accessToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_ACCESS_TOKEN_TTL
		});

		const refreshToken = await this.jwtService.signAsync(payload, {
			expiresIn: this.JWT_REFRESH_TOKEN_TTL
		});

		return {
			accessToken,
			refreshToken,
			refreshTokenExpires
		};
	}
}
