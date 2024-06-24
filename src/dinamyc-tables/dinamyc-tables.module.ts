import { Module } from '@nestjs/common';
import { DinamycTablesService } from './dinamyc-tables.service';
import { DinamycTablesController } from './dinamyc-tables.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { regTable } from './entities/dinamyc-table.entity';
import { JwtService } from 'src/services/jwt.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports:[
    SequelizeModule.forFeature([regTable]),
    JwtModule
  ],
  controllers: [DinamycTablesController],
  providers: [DinamycTablesService, JwtService],
})
export class DinamycTablesModule {}
