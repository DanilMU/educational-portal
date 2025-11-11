import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateAnswerDto {
	@IsString()
	@IsOptional()
	id?: string;

	@IsString()
	@IsOptional()
	text?: string;

	@IsBoolean()
	@IsOptional()
	isCorrect?: boolean;
}
