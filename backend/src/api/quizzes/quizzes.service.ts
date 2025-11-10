import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { CreateQuizDto, UpdateQuizDto } from './dto';

@Injectable()
export class QuizzesService {
	constructor(private readonly prisma: PrismaService) {}

	create(createQuizDto: CreateQuizDto) {
		return this.prisma.quiz.create({ data: createQuizDto });
	}

	findAll() {
		return this.prisma.quiz.findMany();
	}

	findOne(id: string) {
		return this.prisma.quiz.findUnique({ where: { id } });
	}

	update(id: string, updateQuizDto: UpdateQuizDto) {
		return this.prisma.quiz.update({
			where: { id },
			data: updateQuizDto
		});
	}

	remove(id: string) {
		return this.prisma.quiz.delete({ where: { id } });
	}
}
