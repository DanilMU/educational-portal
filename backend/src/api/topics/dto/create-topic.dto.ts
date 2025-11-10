import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTopicDto {
	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	subjectId: string;

	@IsString()
	@IsOptional()
	parentId?: string;
}
