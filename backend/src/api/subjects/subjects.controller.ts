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
import { CreateSubjectDto, UpdateSubjectDto } from './dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
	constructor(private readonly subjectsService: SubjectsService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	create(@Body() createSubjectDto: CreateSubjectDto) {
		return this.subjectsService.create(createSubjectDto);
	}

	@Get()
	findAll() {
		return this.subjectsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.subjectsService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	update(
		@Param('id') id: string,
		@Body() updateSubjectDto: UpdateSubjectDto
	) {
		return this.subjectsService.update(id, updateSubjectDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	remove(@Param('id') id: string) {
		return this.subjectsService.remove(id);
	}
}
