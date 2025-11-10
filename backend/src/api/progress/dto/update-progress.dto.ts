import { IsBoolean, IsString } from 'class-validator';

export class UpdateProgressDto {
	@IsString()
	lessonId: string;

	@IsBoolean()
	isCompleted: boolean;
}
