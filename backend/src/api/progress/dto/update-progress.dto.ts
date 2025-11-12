import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateProgressDto {
	@IsBoolean()
	@IsOptional()
	isCompleted?: boolean;
}
