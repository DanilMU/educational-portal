import { Role } from '@prisma/client';
import {
	IsEmail,
	IsEnum,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator';

export class CreateUserDto {
	@IsEmail()
	public email!: string;

	@MinLength(8, {
		message: 'Password must be at least 8 characters long'
	})
	@IsString()
	public password!: string;

	@IsString()
	@IsOptional()
	public firstName?: string;

	@IsString()
	@IsOptional()
	public lastName?: string;

	@IsEnum(Role)
	@IsOptional()
	public role?: Role;
}
