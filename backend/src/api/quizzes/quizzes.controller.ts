import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common';

import { CreateQuizDto, SubmitQuizDto, UpdateQuizDto } from './dto';
import { QuizzesService } from './quizzes.service';

@Controller('quizzes')
export class QuizzesController {
	constructor(private readonly quizzesService: QuizzesService) {}

	@Post()
	create(@Body() createQuizDto: CreateQuizDto) {
		return this.quizzesService.create(createQuizDto);
	}

	@Get()
	findAll() {
		return this.quizzesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.quizzesService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
		return this.quizzesService.update(id, updateQuizDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.quizzesService.remove(id);
	}

	@Post(':id/submit')
	submit(@Param('id') id: string, @Body() submitQuizDto: SubmitQuizDto) {
		return this.quizzesService.submit(id, submitQuizDto);
	}
}
