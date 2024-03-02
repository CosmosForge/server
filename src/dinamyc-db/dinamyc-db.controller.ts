import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DinamycDbService } from './dinamyc-db.service';
import { CreateDinamycDbDto } from './dto/create-dinamyc-db.dto';
import { UpdateDinamycDbDto } from './dto/update-dinamyc-db.dto';
import { DinamycDb } from './entities/dinamyc-db.entity';

@Controller('db/:db')
export class DinamycDbController {
  constructor(private readonly dinamycDbService: DinamycDbService) {}

  @Post()
  create(@Body() createDinamycDbDto: CreateDinamycDbDto, @Param('db') db: string) {
    return this.dinamycDbService.create(db, createDinamycDbDto);
  }

  @Get("")
  findAll(@Param('db') db: string) {
    console.log(db)
    return this.dinamycDbService.findAll(db);
  }
  @Get('/one')
  findOne(@Param('db') db: string, @Body() where:{}) {
    return this.dinamycDbService.findOne(db, where);
  }
  @Get(':id')
  findById(@Param('db') db: string, @Param('id') id: string) {
    return this.dinamycDbService.findById(db, +id);
  }

  @Patch(':id')
  update(@Param('db') db: string, @Param('id') id: string, @Body() updateDinamycDbDto: UpdateDinamycDbDto) {
    return this.dinamycDbService.update(db, +id, updateDinamycDbDto);
  }

  @Delete(':id')
  remove(@Param('db') db: string, @Param('id') id: string) {
    return this.dinamycDbService.remove(db, +id);
  }

  @Post("/table")
  createDb(@Param('db') db:string, @Body() dinamycDb: DinamycDb){
    this.dinamycDbService.createDB(db, dinamycDb)
  }
  @Delete()
  drop(@Param('db') db: string) {
    return this.dinamycDbService.drop(db);
  }
}
