import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerController } from './logger.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Logger } from './entities/logger.entity';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    SequelizeModule.forFeature([Logger]),
    JwtModule
  ],
  controllers: [LoggerController],
  providers: [LoggerService, JwtService],
  exports:[LoggerService]
})
export class LoggerModule {}
 