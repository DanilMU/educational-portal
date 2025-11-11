import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UserAnswerDto {
	@IsString()
	@IsNotEmpty()
	questionId: string;

	@IsArray()
	@IsString({ each: true })
	answerIds: string[];
}
