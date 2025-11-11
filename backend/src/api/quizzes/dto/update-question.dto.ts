import { QuestionType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
	IsArray,
	IsEnum,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';

import { UpdateAnswerDto } from './update-answer.dto';

export class UpdateQuestionDto {
	@IsString()
	@IsOptional()
	id?: string;

	@IsString()
	@IsOptional()
	text?: string;

	@IsEnum(QuestionType)
	@IsOptional()
	type?: QuestionType;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateAnswerDto)
	@IsOptional()
	answers?: UpdateAnswerDto[];
}
