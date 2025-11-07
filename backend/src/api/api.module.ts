import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TopicsModule } from './topics/topics.module';
import { LessonsModule } from './lessons/lessons.module';
import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		SubjectsModule,
		TopicsModule,
		LessonsModule,
		QuizzesModule
	]
})
export class ApiModule {}
