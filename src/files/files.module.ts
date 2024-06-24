import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { File, Folder } from './entities/files.entity';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports:[
    SequelizeModule.forFeature([Folder, File]),
    JwtModule
  ],
  controllers: [FilesController],
  providers: [FilesService, JwtService],
})
export class FilesModule {}
