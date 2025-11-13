import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Authorized, Roles } from 'src/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

import {
	CompleteSubjectDto,
	CreateProgressDto,
	ProgressDto,
	UpdateProgressDto
} from './dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
	constructor(private readonly progressService: ProgressService) {}

	@Post()
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(JwtAuthGuard, RolesGuard)
	create(
		@Authorized('id') userId: string,
		@Body() createProgressDto: CreateProgressDto
	): Promise<ProgressDto> {
		return this.progressService.create(userId, createProgressDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@Authorized('id') userId: string): Promise<ProgressDto[]> {
		return this.progressService.findAll(userId);
	}

	@Get(':lessonId')
	@UseGuards(JwtAuthGuard)
	findOne(
		@Authorized('id') userId: string,
		@Param('lessonId') lessonId: string
	): Promise<ProgressDto | null> {
		return this.progressService.findOne(userId, lessonId);
	}

	@Patch(':lessonId')
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(JwtAuthGuard, RolesGuard)
	update(
		@Authorized('id') userId: string,
		@Param('lessonId') lessonId: string,
		@Body() updateProgressDto: UpdateProgressDto
	): Promise<ProgressDto> {
		return this.progressService.update(userId, lessonId, updateProgressDto);
	}

	@Delete(':lessonId')
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(JwtAuthGuard, RolesGuard)
	remove(
		@Authorized('id') userId: string,
		@Param('lessonId') lessonId: string
	): Promise<ProgressDto> {
		return this.progressService.remove(userId, lessonId);
	}

	@Post('complete-subject')
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(JwtAuthGuard, RolesGuard)
	completeSubject(@Body() dto: CompleteSubjectDto) {
		return this.progressService.completeAllLessonsInSubject(dto);
	}
}
