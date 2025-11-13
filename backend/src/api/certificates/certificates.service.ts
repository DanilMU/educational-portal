import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException
} from '@nestjs/common';
import { Role, User } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { transliterateCyrillic } from 'src/common/utils/transliterate.util';
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

		try {
			const pdfDoc = await PDFDocument.create();
			const page = pdfDoc.addPage([600, 400]);
			const { width, height } = page.getSize();

			// Use standard fonts and handle Cyrillic characters by transliterating them
			const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
			const textSize = 30;

			// Use transliterated Russian text for the certificate
			const text = transliterateCyrillic(
				'Сертификат о прохождении курса'
			);
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

			// Use transliterated Russian template text
			const line1 = transliterateCyrillic(
				'Настоящим подтверждается, что'
			);
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

			// Process the user name to handle Cyrillic characters by transliterating them
			const firstName = certificate.user.firstName || '';
			const lastName = certificate.user.lastName || '';
			const userName = `${firstName} ${lastName}`.trim();

			// Transliterate Cyrillic characters to Latin
			const transliteratedUserName = transliterateCyrillic(userName);
			const userNameWidth = font.widthOfTextAtSize(
				transliteratedUserName,
				35
			);
			page.drawText(transliteratedUserName, {
				x: (width - userNameWidth) / 2,
				y: height - 170,
				size: 35,
				font,
				color: rgb(0, 0, 0)
			});

			const line2 = transliterateCyrillic('успешно завершил(а) курс');
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

			// Process the subject name to handle Cyrillic characters by transliterating them
			const subjectName = certificate.subject.title;
			const transliteratedSubjectName =
				transliterateCyrillic(subjectName);
			const subjectNameWidth = font.widthOfTextAtSize(
				transliteratedSubjectName,
				35
			);
			page.drawText(transliteratedSubjectName, {
				x: (width - subjectNameWidth) / 2,
				y: height - 270,
				size: 35,
				font,
				color: rgb(0, 0, 0)
			});

			const date =
				transliterateCyrillic('Выдан: ') +
				certificate.issuedAt.toLocaleDateString();
			const dateWidth = smallerFont.widthOfTextAtSize(date, 15);
			page.drawText(date, {
				x: (width - dateWidth) / 2,
				y: height - 350,
				size: 15,
				font: smallerFont,
				color: rgb(0.5, 0.5, 0.5)
			});

			const pdfBytes = await pdfDoc.save();

			// Create uploads directory if it doesn't exist
			const uploadsDir = path.join(process.cwd(), 'uploads');
			if (!fs.existsSync(uploadsDir)) {
				fs.mkdirSync(uploadsDir, { recursive: true });
			}

			// Generate a unique filename
			const fileName = `certificate_${id}_${Date.now()}.pdf`;
			const filePath = path.join(uploadsDir, fileName);

			// Write the PDF to the file
			fs.writeFileSync(filePath, pdfBytes);

			return Buffer.from(pdfBytes);
		} catch (error: any) {
			console.error('Error generating PDF:', error);
			const errorMessage =
				error instanceof Error ? error.message : 'Unknown error';
			throw new Error(
				'Failed to generate certificate PDF: ' + errorMessage
			);
		}
	}
}
