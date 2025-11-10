import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { CreateLessonDto, UpdateLessonDto } from './dto';

@Injectable()
export class LessonsService {
	constructor(private readonly prisma: PrismaService) {}

	create(createLessonDto: CreateLessonDto) {
		return this.prisma.lesson.create({ data: createLessonDto });
	}

	findAll() {
		return this.prisma.lesson.findMany();
	}

	findOne(id: string) {
		return this.prisma.lesson.findUnique({ where: { id } });
	}

	update(id: string, updateLessonDto: UpdateLessonDto) {
		return this.prisma.lesson.update({
			where: { id },
			data: updateLessonDto
		});
	}

	remove(id: string) {
		return this.prisma.lesson.delete({ where: { id } });
	}
}
