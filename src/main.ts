import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FilesService } from './files/files.service';
import { PagesService } from './pages/pages.service';
import { UsersService } from './users/users.service';
import cookieParser from 'cookie-parser';
import * as dotenv from "dotenv"
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_NAME)
  global.appRoot = __dirname;
  app.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONT_URL, // Разрешить запросы от этого источника
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.get(FilesService).initialFilesDirs();
  app.get(PagesService).initialPage();
  app.get(UsersService).initAdmin();
  await app.listen(3000);
}
bootstrap();
