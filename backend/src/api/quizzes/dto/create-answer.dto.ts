import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
	@IsString()
	@IsNotEmpty()
	text: string;

	@IsBoolean()
	isCorrect: boolean;
}
