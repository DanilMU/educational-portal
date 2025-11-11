import { Type } from 'class-transformer';
import {
	IsArray,
	IsNotEmpty,
	IsString,
	ValidateNested
} from 'class-validator';

import { CreateQuestionDto } from './create-question.dto';

export class CreateQuizDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	lessonId: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateQuestionDto)
	questions: CreateQuestionDto[];
}
