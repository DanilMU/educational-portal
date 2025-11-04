import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

import { GetMeDto } from './dto';

@Injectable()
export class UsersService {
	public getMe(user: User): GetMeDto {
		return {
			id: user.id,
			email: user.email,
			firstName: user.firstName ?? '',
			lastName: user.lastName ?? '',
			role: user.role
		};
	}
}
