import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { CreateProgressDto, UpdateProgressDto } from './dto';

@Injectable()
export class ProgressService {
	constructor(private readonly prisma: PrismaService) {}

	async create(userId: string, createProgressDto: CreateProgressDto) {
		const { lessonId, isCompleted } = createProgressDto;
		const completedAt = isCompleted ? new Date() : null;

		return this.prisma.userProgress.create({
			data: {
				userId,
				lessonId,
				isCompleted,
				completedAt
			}
		});
	}

	findAll(userId: string) {
		return this.prisma.userProgress.findMany({
			where: { userId },
			include: {
				lesson: {
					select: {
						id: true,
						title: true,
						topic: {
							select: {
								id: true,
								title: true,
								subject: {
									select: {
										id: true,
										title: true
									}
								}
							}
						}
					}
				}
			}
		});
	}

	async findOne(userId: string, lessonId: string) {
		const progress = await this.prisma.userProgress.findUnique({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			},
			include: {
				lesson: {
					select: {
						id: true,
						title: true,
						topic: {
							select: {
								id: true,
								title: true,
								subject: {
									select: {
										id: true,
										title: true
									}
								}
							}
						}
					}
				}
			}
		});

		if (!progress) {
			throw new NotFoundException(
				`Progress for user ${userId} on lesson ${lessonId} not found`
			);
		}

		return progress;
	}

	async update(
		userId: string,
		lessonId: string,
		updateProgressDto: UpdateProgressDto
	) {
		const existingProgress = await this.prisma.userProgress.findUnique({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			}
		});

		if (!existingProgress) {
			throw new NotFoundException(
				`Progress for user ${userId} on lesson ${lessonId} not found`
			);
		}

		const completedAt =
			updateProgressDto.isCompleted && !existingProgress.completedAt
				? new Date()
				: existingProgress.completedAt;

		return this.prisma.userProgress.update({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			},
			data: {
				...updateProgressDto,
				completedAt
			}
		});
	}

	async remove(userId: string, lessonId: string) {
		return this.prisma.userProgress.delete({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			}
		});
	}

	async markLessonAsCompleted(userId: string, lessonId: string) {
		return this.prisma.userProgress.upsert({
			where: {
				userId_lessonId: {
					userId,
					lessonId
				}
			},
			create: {
				userId,
				lessonId,
				isCompleted: true,
				completedAt: new Date()
			},
			update: {
				isCompleted: true,
				completedAt: new Date()
			}
		});
	}
}
