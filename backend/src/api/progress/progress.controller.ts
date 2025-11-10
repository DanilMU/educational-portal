import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	Query
} from '@nestjs/common';
import { Authorized, Protected } from 'src/common/decorators';

import { UpdateProgressDto } from './dto';
import { ProgressService } from './progress.service';

@Controller('progress')
export class ProgressController {
	constructor(private readonly progressService: ProgressService) {}

	@Post()
	@Protected()
	@HttpCode(HttpStatus.OK)
	updateProgress(
		@Authorized() userId: string,
		@Body() updateProgressDto: UpdateProgressDto
	) {
		return this.progressService.updateProgress(userId, updateProgressDto);
	}

	@Get()
	@Protected()
	getProgress(
		@Authorized() userId: string,
		@Query('subjectId') subjectId: string
	) {
		return this.progressService.getProgressBySubject(userId, subjectId);
	}
}
