import { PrismaClient } from '@prisma/client';

import { occupationalSafetyData } from './data';

const prisma = new PrismaClient();

async function main() {
	console.log(`Start seeding ...`);

	// Удаляем старые данные, чтобы избежать дубликатов
	await prisma.lesson.deleteMany();
	await prisma.topic.deleteMany();
	await prisma.subject.deleteMany();
	console.log('Old data deleted.');

	const subject = await prisma.subject.create({
		data: {
			title: occupationalSafetyData.title,
			description: occupationalSafetyData.description
		}
	});
	console.log(`Created subject: ${subject.title}`);

	for (const topicData of occupationalSafetyData.topics) {
		const topic = await prisma.topic.create({
			data: {
				title: topicData.title,
				subjectId: subject.id
			}
		});
		console.log(`  Created topic: ${topic.title}`);

		if (topicData.children && topicData.children.length > 0) {
			for (const subTopicData of topicData.children) {
				const subTopic = await prisma.topic.create({
					data: {
						title: subTopicData.title,
						subjectId: subject.id,
						parentId: topic.id
					}
				});
				console.log(`    Created sub-topic: ${subTopic.title}`);

				if (subTopicData.lessons && subTopicData.lessons.length > 0) {
					for (const lessonData of subTopicData.lessons) {
						const lesson = await prisma.lesson.create({
							data: {
								title: lessonData.title,
								topicId: subTopic.id,
								content: `Содержимое для урока "${lessonData.title}"` // Placeholder content
							}
						});
						console.log(`      Created lesson: ${lesson.title}`);
					}
				}
			}
		}
	}

	console.log(`Seeding finished.`);
}

main()
	.catch(e => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
