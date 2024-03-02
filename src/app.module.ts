import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from "dotenv"
import { DinamycDbModule } from './dinamyc-db/dinamyc-db.module';
import { DinamycDbService } from './dinamyc-db/dinamyc-db.service';
import { ImagesModule } from './images/images.module';
import { PagesModule } from './pages/pages.module';
import { Pages } from './pages/entities/pages.entity';
import { Dialect } from 'sequelize';
dotenv.config()

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/static',
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => ({
        dialect: process.env.DB_TYPE as Dialect,
        host:  process.env.DB_HOST as Dialect,
        username:  process.env.DB_USER as Dialect,
        password: process.env.DB_PASS as Dialect,
        database:  process.env.DB_NAME_PRODUCTION as Dialect,
        synchronize: true, 
        autoLoadModels: true,
        models: [Pages],
        sync: { force: false, alter: true }
      })
    }),
    DinamycDbModule,
    ImagesModule,
    PagesModule,
  ],
  controllers: [AppController],
  providers: [AppService, DinamycDbService],
})
export class AppModule {

}
