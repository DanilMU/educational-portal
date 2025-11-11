import { QuestionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsString,
	ValidateNested
} from 'class-validator';

import { CreateAnswerDto } from './create-answer.dto';

export class CreateQuestionDto {
	@IsString()
	@IsNotEmpty()
	text: string;

	@IsEnum(QuestionType)
	type: QuestionType;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateAnswerDto)
	answers: CreateAnswerDto[];
}
