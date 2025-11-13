import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import {
	CompleteSubjectDto,
	CreateProgressDto,
	ProgressDto,
	UpdateProgressDto
} from './dto';

@Injectable()
export class ProgressService {
	constructor(private readonly prisma: PrismaService) {}

	create(
		userId: string,
		createProgressDto: CreateProgressDto
	): Promise<ProgressDto> {
		const { lessonId, isCompleted } = createProgressDto;
		return this.prisma.userProgress.create({
			data: {
				userId,
				lessonId,
				isCompleted,
				completedAt: isCompleted ? new Date() : null
			}
		});
	}

	findAll(userId: string): Promise<ProgressDto[]> {
		return this.prisma.userProgress.findMany({
			where: { userId }
		});
	}

	async findOne(
		userId: string,
		lessonId: string
	): Promise<ProgressDto | null> {
		const progress = await this.prisma.userProgress.findUnique({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			}
		});
		return progress;
	}

	update(
		userId: string,
		lessonId: string,
		updateProgressDto: UpdateProgressDto
	): Promise<ProgressDto> {
		return this.prisma.userProgress.update({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			},
			data: {
				isCompleted: updateProgressDto.isCompleted,
				completedAt: updateProgressDto.isCompleted ? new Date() : null
			}
		});
	}

	async remove(userId: string, lessonId: string): Promise<ProgressDto> {
		return this.prisma.userProgress.delete({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			}
		});
	}

	async completeAllLessonsInSubject(
		dto: CompleteSubjectDto
	): Promise<{ count: number }> {
		const { userId, subjectId } = dto;

		// Проверяем, существует ли пользователь
		const user = await this.prisma.user.findUnique({
			where: { id: userId }
		});

		if (!user) {
			throw new NotFoundException(`User with ID ${userId} not found`);
		}

		const subject = await this.prisma.subject.findUnique({
			where: { id: subjectId },
			include: {
				topics: {
					include: {
						lessons: {
							select: {
								id: true
							}
						}
					}
				}
			}
		});

		if (!subject) {
			throw new NotFoundException(
				`Subject with ID ${subjectId} not found`
			);
		}

		const lessonIds = subject.topics.flatMap(topic =>
			topic.lessons.map(lesson => lesson.id)
		);

		if (lessonIds.length === 0) {
			return { count: 0 }; // No lessons to complete
		}

		const dataToCreate = lessonIds.map(lessonId => ({
			userId,
			lessonId,
			isCompleted: true,
			completedAt: new Date()
		}));

		const result = await this.prisma.userProgress.createMany({
			data: dataToCreate,
			skipDuplicates: true // Avoids errors if progress already exists
		});

		return result;
	}
	async markLessonAsCompleted(
		userId: string,
		lessonId: string
	): Promise<ProgressDto> {
		const existingProgress = await this.prisma.userProgress.findUnique({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			}
		});

		if (existingProgress) {
			return this.prisma.userProgress.update({
				where: {
					userId_lessonId: {
						userId,
						lessonId
					}
				},
				data: {
					isCompleted: true,
					completedAt: new Date()
				}
			});
		} else {
			return this.prisma.userProgress.create({
				data: {
					userId,
					lessonId,
					isCompleted: true,
					completedAt: new Date()
				}
			});
		}
	}
}
