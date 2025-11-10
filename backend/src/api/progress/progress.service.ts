import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { UpdateProgressDto } from './dto';

@Injectable()
export class ProgressService {
	constructor(private readonly prisma: PrismaService) {}

	async updateProgress(
		userId: string,
		{ lessonId, isCompleted }: UpdateProgressDto
	) {
		const completedAt = isCompleted ? new Date() : null;

		return this.prisma.userProgress.upsert({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			},
			update: {
				isCompleted,
				completedAt
			},
			create: {
				userId,
				lessonId,
				isCompleted,
				completedAt
			}
		});
	}

	async getProgressBySubject(userId: string, subjectId: string) {
		const lessons = await this.prisma.lesson.findMany({
			where: {
				topic: {
					subjectId: subjectId
				}
			},
			select: {
				id: true
			}
		});

		const lessonIds = lessons.map(lesson => lesson.id);
		const totalLessons = lessonIds.length;

		if (totalLessons === 0) {
			return {
				totalLessons: 0,
				completedLessons: 0
			};
		}

		const completedLessons = await this.prisma.userProgress.count({
			where: {
				userId: userId,
				lessonId: {
					in: lessonIds
				},
				isCompleted: true
			}
		});

		return {
			totalLessons,
			completedLessons
		};
	}
}
