import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
	public constructor(private readonly authService: AuthService) {}

	@Post('register')
	public async register(@Body() dto: RegisterDto) {
		return await this.authService.register(dto);
	}

	@Post('login')
	public async login(@Body() dto: LoginDto) {
		return await this.authService.login(dto);
	}
}
