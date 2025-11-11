import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { CreateQuizDto, UpdateQuizDto } from './dto';

@Injectable()
export class QuizzesService {
	constructor(private readonly prisma: PrismaService) {}

	create(createQuizDto: CreateQuizDto) {
		const { questions, ...rest } = createQuizDto;

		return this.prisma.quiz.create({
			data: {
				...rest,
				questions: {
					create: questions.map(question => ({
						...question,
						answers: {
							create: question.answers
						}
					}))
				}
			}
		});
	}

	findAll() {
		return this.prisma.quiz.findMany({
			include: {
				questions: {
					include: {
						answers: true
					}
				}
			}
		});
	}

	findOne(id: string) {
		return this.prisma.quiz.findUnique({
			where: { id },
			include: {
				questions: {
					include: {
						answers: true
					}
				}
			}
		});
	}

	update(id: string, updateQuizDto: UpdateQuizDto) {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { lessonId, questions, ...rest } = updateQuizDto;

		return this.prisma.quiz.update({
			where: { id },
			data: rest
		});
	}

	remove(id: string) {
		return this.prisma.quiz.delete({ where: { id } });
	}
}
