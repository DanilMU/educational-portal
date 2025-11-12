import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
	private readonly uploadDir = path.join(process.cwd(), 'uploads');

	constructor() {
		if (!fs.existsSync(this.uploadDir)) {
			fs.mkdirSync(this.uploadDir, { recursive: true });
		}
	}

	async uploadFile(file: Express.Multer.File): Promise<string> {
		const filename = `${Date.now()}-${file.originalname}`;
		const filePath = path.join(this.uploadDir, filename);

		await fs.promises.writeFile(filePath, file.buffer);

		return `/uploads/${filename}`; // Return a URL-friendly path
	}
}
