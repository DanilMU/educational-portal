import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCertificateDto {
	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsString()
	@IsNotEmpty()
	subjectId: string;
}
