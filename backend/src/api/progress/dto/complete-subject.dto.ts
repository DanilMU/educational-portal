import { IsNotEmpty, IsString } from 'class-validator';

export class CompleteSubjectDto {
	@IsNotEmpty()
	@IsString()
	userId!: string;

	@IsNotEmpty()
	@IsString()
	subjectId!: string;
}
