import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common';

import { CreateSubjectDto, UpdateSubjectDto } from './dto';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
	constructor(private readonly subjectsService: SubjectsService) {}

	@Post()
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
	update(
		@Param('id') id: string,
		@Body() updateSubjectDto: UpdateSubjectDto
	) {
		return this.subjectsService.update(id, updateSubjectDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.subjectsService.remove(id);
	}
}
