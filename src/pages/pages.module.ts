import { Module } from '@nestjs/common';
import { PagesService } from './pages.service';
import { PagesController } from './pages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Pages } from './entities/pages.entity';


@Module({
  imports:[
    SequelizeModule.forFeature([Pages]),
  ],
  controllers: [PagesController],
  providers: [PagesService]
})
export class PagesModule {}
