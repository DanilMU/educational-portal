import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterRequest {
	@ApiProperty({
		example: 'John',
		description: 'firstName of the user'
	})
	@IsString()
	@IsNotEmpty()
	public firstName!: string;

	@ApiProperty({
		example: 'Doe',
		description: 'lastName of the user'
	})
	@IsString()
	@IsNotEmpty()
	public lastName!: string;

	@ApiProperty({
		example: 'john@example.com',
		description: 'Email address of the user'
	})
	@IsEmail()
	@IsNotEmpty()
	public email!: string;

	@ApiProperty({
		example: 'strongPassword123',
		description: 'Password for the account'
	})
	@IsString()
	@IsNotEmpty()
	@MinLength(6)
	public password!: string;
}
