import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { InfraModule } from './infra/infra.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true
		}),
		ApiModule,
		InfraModule
	],
	controllers: [AppController]
})
export class AppModule {}
