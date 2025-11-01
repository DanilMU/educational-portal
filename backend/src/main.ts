import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { getCorsConfig, getSwaggerConfig } from './config';

/**
 * Точка входа в приложение.
 * Эта функция инициализирует и запускает NestJS приложение.
 */
async function bootstrap() {
	// Создаем экземпляр приложения NestJS, используя корневой модуль AppModule.
	const app = await NestFactory.create(AppModule);

	// Получаем доступ к сервису конфигурации.
	const config = app.get(ConfigService);
	// Создаем логгер для вывода сообщений.
	const logger = new Logger(AppModule.name);

	app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

	app.useGlobalPipes(new ValidationPipe());

	// Включаем CORS с настройками из конфигурационного файла.
	app.enableCors(getCorsConfig(config));

	const swaggerConfig = getSwaggerConfig();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('/docs', app, swaggerDocument, {
		jsonDocumentUrl: 'openapi.json'
	});

	// Получаем порт и хост из конфигурации.
	const port = config.getOrThrow<number>('HTTP_PORT');
	const host = config.getOrThrow<string>('HTTP_HOST');

	try {
		// Запускаем приложение на указанном порту.
		await app.listen(port);

		// Логируем сообщение об успешном запуске.
		logger.log(`Server is running at: ${host}`);
	} catch (error: unknown) {
		if (error instanceof Error) {
			logger.error(`Failed to start server: ${error.message}`, error);
		} else {
			logger.error('Failed to start server: Unknown error', error);
		}
		process.exit(1);
	}
}

// Запускаем асинхронную функцию bootstrap.
void bootstrap();
