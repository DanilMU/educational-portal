import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class ProgressDto {
	@IsString()
	id: string;

	@IsString()
	userId: string;

	@IsString()
	lessonId: string;

	@IsBoolean()
	isCompleted: boolean;

	@IsDate()
	@IsOptional()
	completedAt: Date | null;

	@IsDate()
	createdAt: Date;

	@IsDate()
	updatedAt: Date;
}
