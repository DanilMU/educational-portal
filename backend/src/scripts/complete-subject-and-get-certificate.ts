import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { CertificatesService } from '../api/certificates/certificates.service';
import { AppModule } from '../app.module';
import { PrismaService } from '../infra/prisma/prisma.service';

async function completeSubjectAndCertificate() {
	const app: INestApplication = await NestFactory.create(AppModule);
	const prisma = app.get(PrismaService);
	const certificatesService = app.get(CertificatesService);

	try {
		// Получаем пользователя (предположим, что это администратор)
		const user = await prisma.user.findFirst({
			where: { role: 'ADMIN' }
		});

		if (!user) {
			console.log('Администратор не найден');
			return;
		}

		// Получаем все предметы с темами и уроками
		const subjects = await prisma.subject.findMany({
			include: {
				topics: {
					include: {
						lessons: true
					}
				}
			}
		});

		for (const subject of subjects) {
			console.log(`Обработка предмета: ${subject.title}`);

			// Завершаем все уроки по предмету для пользователя
			await prisma.userProgress.createMany({
				data: subject.topics.flatMap(topic =>
					topic.lessons.map(lesson => ({
						userId: user.id,
						lessonId: lesson.id,
						isCompleted: true,
						completedAt: new Date()
					}))
				),
				skipDuplicates: true
			});

			console.log(`Завершены все уроки по предмету: ${subject.title}`);

			// Создаем сертификат для пользователя по этому предмету
			try {
				const certificate = await certificatesService.create({
					userId: user.id,
					subjectId: subject.id
				});
				console.log(
					`Сертификат создан для предмета: ${subject.title}`,
					certificate.id
				);
			} catch (certError: any) {
				console.log(
					`Не удалось создать сертификат для предмета: ${subject.title}`,
					certError.message
				);
			}
		}

		console.log(
			'Все уроки завершены и сертификаты обработаны для администратора'
		);
	} catch (error) {
		console.error(
			'Ошибка при завершении уроков или создании сертификатов:',
			error
		);
	} finally {
		await app.close();
	}
}

completeSubjectAndCertificate();

completeSubjectAndCertificate();
