import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pages } from './entities/pages.entity';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    SequelizeModule.forFeature([Pages]),
    JwtModule
  ],
  controllers: [PagesController],
  providers: [PagesService, JwtService]
})
export class PagesModule {}
