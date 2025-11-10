import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CertificatesModule } from './certificates/certificates.module';
import { LessonsModule } from './lessons/lessons.module';
import { ProgressModule } from './progress/progress.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { SubjectsModule } from './subjects/subjects.module';
import { TopicsModule } from './topics/topics.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		SubjectsModule,
		TopicsModule,
		LessonsModule,
		QuizzesModule,
		ProgressModule,
		CertificatesModule
	]
})
export class ApiModule {}
