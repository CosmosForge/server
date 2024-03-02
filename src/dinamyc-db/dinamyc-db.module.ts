import { Module } from '@nestjs/common';
import { DinamycDbService } from './dinamyc-db.service';
import { DinamycDbController } from './dinamyc-db.controller';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306, // порт для MySQL
      username: 'root',
      password: '',
      database: 'lf-db',
      autoLoadModels: true,
      synchronize: true,
    }),
  ],
  controllers: [DinamycDbController],
  providers: [DinamycDbService],
})
export class DinamycDbModule {}
