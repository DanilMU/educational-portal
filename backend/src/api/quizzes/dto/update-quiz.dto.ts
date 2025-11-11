import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UpdateQuestionDto } from './update-question.dto';

export class UpdateQuizDto {
	@IsString()
	@IsOptional()
	title?: string;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateQuestionDto)
	@IsOptional()
	questions?: UpdateQuestionDto[];
}
