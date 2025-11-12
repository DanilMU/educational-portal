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
import { Roles } from 'src/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

import { CreateLessonDto, UpdateLessonDto } from './dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
	constructor(private readonly lessonsService: LessonsService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	create(@Body() createLessonDto: CreateLessonDto) {
		return this.lessonsService.create(createLessonDto);
	}

	@Get()
	findAll() {
		return this.lessonsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.lessonsService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
		return this.lessonsService.update(id, updateLessonDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	remove(@Param('id') id: string) {
		return this.lessonsService.remove(id);
	}
}
