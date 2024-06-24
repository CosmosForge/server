import { Module } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Template } from './entities/template.entity';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    SequelizeModule.forFeature([Template]),
    JwtModule
  ],
  controllers: [TemplatesController],
  providers: [TemplatesService, JwtService],
})
export class TemplatesModule {}
