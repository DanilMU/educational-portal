import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';

import { UserAnswerDto } from './user-answer.dto';

export class SubmitQuizDto {
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UserAnswerDto)
	answers: UserAnswerDto[];
}
