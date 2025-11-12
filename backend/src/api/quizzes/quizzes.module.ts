import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/infra/prisma/prisma.module';

import { ProgressModule } from '../progress/progress.module';
import { QuizzesController } from './quizzes.controller';
import { QuizzesService } from './quizzes.service';

@Module({
	imports: [PrismaModule, ProgressModule],
	controllers: [QuizzesController],
	providers: [QuizzesService]
})
export class QuizzesModule {}
