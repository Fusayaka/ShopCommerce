import "dotenv/config";
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from "@nestjs/common";
import cookieParser from 'cookie-parser';
import { ConfigService } from "@nestjs/config";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true
  }))

  app.setGlobalPrefix('api');

  const port = configService.get<number>("PORT") ?? 3000;
  await app.listen(port);

  console.log(`Run at http://localhost:${port}/api`);

}
await bootstrap();
