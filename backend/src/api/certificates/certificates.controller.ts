import { Controller, Post, Body, Get, Param, UseGuards, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { GetUser, Roles } from 'src/common/decorators';
import { RolesGuard } from 'src/common/guards';
import { User } from 'src/common/interfaces';

import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto';

@Controller('certificates')
export class CertificatesController {
	constructor(private readonly certificatesService: CertificatesService) {}

	@Post()
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(RolesGuard)
	create(@Body() dto: CreateCertificateDto) {
		return this.certificatesService.create(dto);
	}

	@Get()
	@Roles(Role.ADMIN)
	@UseGuards(RolesGuard)
	findAll() {
		return this.certificatesService.findAll();
	}

	@Get('/user/:userId')
	@UseGuards(RolesGuard)
	findByUser(@Param('userId') userId: string, @GetUser() user: User) {
		// Разрешаем доступ, если пользователь запрашивает свои собственные сертификаты
		// или если пользователь является администратором.
		if (user.id !== userId && user.role !== Role.ADMIN) {
			throw new ForbiddenException('У вас нет прав на просмотр этих сертификатов.');
		}
		return this.certificatesService.findByUser(userId);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.certificatesService.findOne(id);
	}
}
