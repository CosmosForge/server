import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PagesModule } from './pages/pages.module';
import { Pages } from './pages/entities/pages.entity';
import { Dialect } from 'sequelize';
import { FilesModule } from './files/files.module';
import { File, Folder } from './files/entities/files.entity';
import { TemplatesModule } from './templates/templates.module';
import { Template } from './templates/entities/template.entity';
import { DinamycTablesModule } from './dinamyc-tables/dinamyc-tables.module';
import { regTable } from './dinamyc-tables/entities/dinamyc-table.entity';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { LoggerModule } from './logger/logger.module';
import { Logger } from './logger/entities/logger.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { LoggerService } from './logger/logger.service';
import { JwtService } from './services/jwt.service';
import * as dotenv from "dotenv"
import { JwtModule } from '@nestjs/jwt';
dotenv.config()

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: `/${process.env.API_NAME}/static`,
    }),
    SequelizeModule.forFeature([Logger]),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: process.env.DB_TYPE as Dialect,
        host:  process.env.DB_HOST,
        username:  process.env.DB_USER,
        password: process.env.DB_PASS,
        database:  process.env.DB_NAME_PRODUCTION,
        synchronize: true, 
        autoLoadModels: true,
        models: [Pages, Folder, File, Template, regTable, User, Logger],
        sync: { force: false, alter: true }
      })
    }),
    PagesModule,
    FilesModule,
    TemplatesModule,
    DinamycTablesModule,
    UsersModule,
    LoggerModule,
    JwtModule
  ],
  controllers: [AppController],
  providers: [AppService, LoggerService, JwtService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .exclude({ path: 'static', method: RequestMethod.GET })
      .forRoutes("")
  }
}
