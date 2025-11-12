import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	Param,
	Post,
	Res,
	UseGuards
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { Response } from 'express';
import { GetUser, Roles } from 'src/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto';

@Controller('certificates')
@UseGuards(JwtAuthGuard)
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
		if (user.id !== userId && user.role !== Role.ADMIN) {
			throw new ForbiddenException(
				'У вас нет прав на просмотр этих сертификатов.'
			);
		}
		return this.certificatesService.findByUser(userId);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @GetUser() user: User) {
		return this.certificatesService.findOne(id, user);
	}

	@Get(':id/download')
	async download(
		@Param('id') id: string,
		@GetUser() user: User,
		@Res() res: Response
	) {
		const pdfBuffer = await this.certificatesService.generatePdf(id, user);

		res.set({
			'Content-Type': 'application/pdf',
			'Content-Length': pdfBuffer.length,
			'Content-Disposition': `attachment; filename="certificate-${id}.pdf"`
		});

		res.send(pdfBuffer);
	}
}
