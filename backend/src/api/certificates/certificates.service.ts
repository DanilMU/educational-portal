import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { CreateCertificateDto } from './dto';

@Injectable()
export class CertificatesService {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateCertificateDto) {
		const { userId, subjectId } = dto;

		// 1. Проверить, существует ли такой предмет
		const subject = await this.prisma.subject.findUnique({
			where: { id: subjectId },
			include: {
				topics: {
					include: {
						lessons: true
					}
				}
			}
		});

		if (!subject) {
			throw new NotFoundException('Предмет не найден');
		}

		// 2. Получить все уроки для данного предмета
		const allLessons = subject.topics.flatMap(topic => topic.lessons);
		const totalLessonsCount = allLessons.length;

		if (totalLessonsCount === 0) {
			throw new BadRequestException(
				'В этом предмете нет уроков для завершения.'
			);
		}

		// 3. Посчитать количество пройденных пользователем уроков по этому предмету
		const completedLessonsCount = await this.prisma.userProgress.count({
			where: {
				userId,
				lessonId: {
					in: allLessons.map(lesson => lesson.id)
				},
				isCompleted: true
			}
		});

		// 4. Сравнить количество пройденных уроков с общим количеством
		if (completedLessonsCount < totalLessonsCount) {
			throw new BadRequestException(
				'Вы еще не завершили все уроки по этому предмету.'
			);
		}

		// 5. Проверить, не выдан ли уже сертификат
		const existingCertificate = await this.prisma.certificate.findFirst({
			where: {
				userId,
				subjectId
			}
		});

		if (existingCertificate) {
			return existingCertificate;
		}

		// 6. Создать сертификат
		// TODO: В будущем здесь будет генерация реального PDF или изображения
		const certificateUrl = `/certificates/user/${userId}/subject/${subjectId}`;

		return this.prisma.certificate.create({
			data: {
				userId,
				subjectId,
				url: certificateUrl,
				issuedAt: new Date()
			}
		});
	}

	findAll() {
		return this.prisma.certificate.findMany({
			include: {
				user: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true
					}
				},
				subject: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});
	}

	findByUser(userId: string) {
		return this.prisma.certificate.findMany({
			where: { userId },
			include: {
				subject: {
					select: {
						id: true,
						title: true
					}
				}
			}
		});
	}

	async findOne(id: string) {
		const certificate = await this.prisma.certificate.findUnique({
			where: { id },
			include: {
				user: {
					select: {
						id: true,
						firstName: true,
						lastName: true,
						email: true
					}
				},
				subject: true
			}
		});

		if (!certificate) {
			throw new NotFoundException('Сертификат не найден');
		}

		return certificate;
	}
}
