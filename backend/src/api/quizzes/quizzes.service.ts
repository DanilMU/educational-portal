import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import {
	CreateQuizDto,
	QuizResultDto,
	SubmitQuizDto,
	UpdateQuizDto
} from './dto';

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

	async update(id: string, updateQuizDto: UpdateQuizDto) {
		const { title, questions } = updateQuizDto;

		return this.prisma.$transaction(async tx => {
			if (title) {
				await tx.quiz.update({
					where: { id },
					data: { title }
				});
			}

			if (questions) {
				const existingQuestions = await tx.question.findMany({
					where: { quizId: id }
				});
				const existingQuestionIds = existingQuestions.map(q => q.id);
				const incomingQuestionIds = questions
					.map(q => q.id)
					.filter(Boolean);

				const questionIdsToDelete = existingQuestionIds.filter(
					existingId => !incomingQuestionIds.includes(existingId)
				);

				if (questionIdsToDelete.length > 0) {
					await tx.question.deleteMany({
						where: { id: { in: questionIdsToDelete } }
					});
				}

				for (const questionDto of questions) {
					const { answers } = questionDto;
					const upsertedQuestion = await tx.question.upsert({
						where: { id: questionDto.id || '' },
						create: {
							text: questionDto.text!, // Assuming text is always provided for new questions
							type: questionDto.type!, // Assuming type is always provided for new questions
							quiz: { connect: { id } }
						},
						update: {
							// Only include properties that are explicitly defined in the DTO for update
							...(questionDto.text !== undefined && {
								text: questionDto.text
							}),
							...(questionDto.type !== undefined && {
								type: questionDto.type
							})
						}
					});

					if (answers) {
						await tx.answer.deleteMany({
							where: { questionId: upsertedQuestion.id }
						});

						await tx.answer.createMany({
							data: answers.map(answer => ({
								text: answer.text!,
								isCorrect: answer.isCorrect!,
								questionId: upsertedQuestion.id
							}))
						});
					}
				}
			}

			return tx.quiz.findUnique({
				where: { id },
				include: {
					questions: {
						include: {
							answers: true
						}
					}
				}
			});
		});
	}

	async submit(
		quizId: string,
		submitQuizDto: SubmitQuizDto
	): Promise<QuizResultDto> {
		const quiz = await this.prisma.quiz.findUnique({
			where: { id: quizId },
			include: {
				questions: {
					include: {
						answers: true
					}
				}
			}
		});

		if (!quiz) {
			throw new NotFoundException(`Quiz with ID ${quizId} not found`);
		}

		const correctAnswersMap = new Map<string, string[]>();
		quiz.questions.forEach(question => {
			const correctIds = question.answers
				.filter(a => a.isCorrect)
				.map(a => a.id);
			correctAnswersMap.set(question.id, correctIds);
		});

		let score = 0;
		for (const userAnswer of submitQuizDto.answers) {
			const correctIds = correctAnswersMap.get(userAnswer.questionId);
			if (!correctIds) continue;

			const userIds = userAnswer.answerIds.sort();
			const sortedCorrectIds = [...correctIds].sort();

			if (JSON.stringify(userIds) === JSON.stringify(sortedCorrectIds)) {
				score++;
			}
		}

		return {
			score,
			totalQuestions: quiz.questions.length
		};
	}

	remove(id: string) {
		return this.prisma.quiz.delete({ where: { id } });
	}
}
