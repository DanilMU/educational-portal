import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
		const certificateUrl = `/certificates/${userId}/${subjectId}`; // Placeholder URL

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

	async findOne(id: string, user: User) {
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

		if (certificate.userId !== user.id && user.role !== Role.ADMIN) {
			throw new ForbiddenException(
				'У вас нет доступа к этому сертификату.'
			);
		}

		return certificate;
	}

	async generatePdf(id: string, user: User): Promise<Buffer> {
		const certificate = await this.findOne(id, user);

		const pdfDoc = await PDFDocument.create();
		const page = pdfDoc.addPage([600, 400]);
		const { width, height } = page.getSize();

		const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
		const textSize = 30;
		const text = 'Certificate of Completion';
		const textWidth = font.widthOfTextAtSize(text, textSize);

		page.drawText(text, {
			x: (width - textWidth) / 2,
			y: height - 50,
			size: textSize,
			font,
			color: rgb(0, 0.53, 0.71)
		});

		const smallerFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
		const smallerTextSize = 20;

		const line1 = 'This is to certify that';
		const lineWidth1 = smallerFont.widthOfTextAtSize(
			line1,
			smallerTextSize
		);
		page.drawText(line1, {
			x: (width - lineWidth1) / 2,
			y: height - 120,
			size: smallerTextSize,
			font: smallerFont,
			color: rgb(0, 0, 0)
		});

		const userName = `${certificate.user.firstName || ''} ${
			certificate.user.lastName || ''
		}`.trim();
		const userNameWidth = font.widthOfTextAtSize(userName, 35);
		page.drawText(userName, {
			x: (width - userNameWidth) / 2,
			y: height - 170,
			size: 35,
			font,
			color: rgb(0, 0, 0)
		});

		const line2 = `has successfully completed the subject`;
		const lineWidth2 = smallerFont.widthOfTextAtSize(
			line2,
			smallerTextSize
		);
		page.drawText(line2, {
			x: (width - lineWidth2) / 2,
			y: height - 220,
			size: smallerTextSize,
			font: smallerFont,
			color: rgb(0, 0, 0)
		});

		const subjectName = certificate.subject.title;
		const subjectNameWidth = font.widthOfTextAtSize(subjectName, 35);
		page.drawText(subjectName, {
			x: (width - subjectNameWidth) / 2,
			y: height - 270,
			size: 35,
			font,
			color: rgb(0, 0, 0)
		});

		const date = `Issued on: ${certificate.issuedAt.toLocaleDateString()}`;
		const dateWidth = smallerFont.widthOfTextAtSize(date, 15);
		page.drawText(date, {
			x: (width - dateWidth) / 2,
			y: height - 350,
			size: 15,
			font: smallerFont,
			color: rgb(0.5, 0.5, 0.5)
		});

		const pdfBytes = await pdfDoc.save();
		return Buffer.from(pdfBytes);
	}
}
