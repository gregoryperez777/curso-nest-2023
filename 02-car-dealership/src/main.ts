import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function main() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({
		whitelist: true, // Remueve todo lo no esta en el DTO es decir property adicionales 
		forbidNonWhitelisted: true // Lanza error cuando se envia data mas (Es decir data que no esta declarada en el DTO)
	}));

	await app.listen(3000);
}

main();
