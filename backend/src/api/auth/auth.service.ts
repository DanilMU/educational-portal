import {
	ConflictException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { Response } from 'express';
import { ms, StringValue } from 'src/common/utils';
import { isDev } from 'src/common/utils/is-dev.util';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { LoginDto, RegisterDto } from './dto';
import { JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
	private readonly JWT_ACCESS_TOKEN_TTL: StringValue;
	private readonly JWT_REFRESH_TOKEN_TTL: StringValue;

	private readonly COOKIES_DOMAIN: string;

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

		this.COOKIES_DOMAIN =
			configService.getOrThrow<StringValue>('COOKIES_DOMAIN');
	}

	public async register(res: Response, dto: RegisterDto) {
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

		return this.auth(res, user);
	}

	public async logout(res: Response) {
		await this.setCookie(res, '', new Date(0));
	}

	private async auth(res: Response, user: User) {
		const { accessToken, refreshToken, refreshTokenExpires } =
			await this.generateTokens(user);

		this.setCookie(res, refreshToken, refreshTokenExpires);

		return { accessToken };
	}

	public async login(res: Response, dto: LoginDto) {
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

		return this.auth(res, user);
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

	private setCookie(res: Response, value: string, expires: Date) {
		res.cookie('refreshToken', value, {
			httpOnly: true,
			domain: this.COOKIES_DOMAIN,
			expires,
			secure: !isDev(this.configService),
			sameSite: 'lax',
			signed: true
		});
	}
}
