import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class GetMeDto {
	@ApiProperty({
		example: 'clx15753m0000o4t2ahn53dfg',
		description: 'User ID'
	})
	public id: string;

	@ApiProperty({
		example: 'john@example.com',
		description: 'Email address of the user'
	})
	public email: string;

	@ApiProperty({ example: 'John', description: 'First name of the user' })
	public firstName: string;

	@ApiProperty({ example: 'Doe', description: 'Last name of the user' })
	public lastName: string;

	@ApiProperty({
		enum: Role,
		example: Role.STUDENT,
		description: 'User role'
	})
	public role: Role;
}
