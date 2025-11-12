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

import { CreateQuizDto, SubmitQuizDto, UpdateQuizDto } from './dto';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
	constructor(private readonly quizzesService: QuizzesService) {}

	@Post()
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(JwtAuthGuard, RolesGuard)
	create(@Body() createQuizDto: CreateQuizDto) {
		return this.quizzesService.create(createQuizDto);
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll() {
		return this.quizzesService.findAll();
	}

	@Get(':id')
	@UseGuards(JwtAuthGuard)
	findOne(@Param('id') id: string) {
		return this.quizzesService.findOne(id);
	}

	@Patch(':id')
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(JwtAuthGuard, RolesGuard)
	update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
		return this.quizzesService.update(id, updateQuizDto);
	}

	@Delete(':id')
	@Roles(Role.ADMIN, Role.MODERATOR)
	@UseGuards(JwtAuthGuard, RolesGuard)
	remove(@Param('id') id: string) {
		return this.quizzesService.remove(id);
	}

	@Post(':id/submit')
	@UseGuards(JwtAuthGuard)
	submit(@Param('id') id: string, @Body() submitQuizDto: SubmitQuizDto) {
		return this.quizzesService.submit(id, submitQuizDto);
	}
}
