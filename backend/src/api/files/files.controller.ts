import {
	Controller,
	FileTypeValidator,
	MaxFileSizeValidator,
	ParseFilePipe,
	Post,
	UploadedFile,
	UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
	constructor(private readonly filesService: FilesService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile(
			new ParseFilePipe({
				validators: [
					new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }), // 5MB
					new FileTypeValidator({
						fileType: '.(png|jpeg|jpg|gif|pdf)'
					})
				]
			})
		)
		file: Express.Multer.File
	) {
		const filePath = await this.filesService.uploadFile(file);
		return { filePath };
	}
}
