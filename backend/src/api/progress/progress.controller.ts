import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common';
import { Authorized, Protected } from 'src/common/decorators';

import { CreateProgressDto, ProgressDto, UpdateProgressDto } from './dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
	constructor(private readonly progressService: ProgressService) {}

	@Post()
	@Protected()
	create(
		@Authorized('id') userId: string,
		@Body() createProgressDto: CreateProgressDto
	): Promise<ProgressDto> {
		return this.progressService.create(userId, createProgressDto);
	}

	@Get()
	@Protected()
	findAll(@Authorized('id') userId: string): Promise<ProgressDto[]> {
		return this.progressService.findAll(userId);
	}

	@Get(':lessonId')
	@Protected()
	findOne(
		@Authorized('id') userId: string,
		@Param('lessonId') lessonId: string
	): Promise<ProgressDto> {
		return this.progressService.findOne(userId, lessonId);
	}

	@Patch(':lessonId')
	@Protected()
	update(
		@Authorized('id') userId: string,
		@Param('lessonId') lessonId: string,
		@Body() updateProgressDto: UpdateProgressDto
	): Promise<ProgressDto> {
		return this.progressService.update(userId, lessonId, updateProgressDto);
	}

	@Delete(':lessonId')
	@Protected()
	remove(
		@Authorized('id') userId: string,
		@Param('lessonId') lessonId: string
	): Promise<ProgressDto> {
		return this.progressService.remove(userId, lessonId);
	}
}
