import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DinamycTablesService } from './dinamyc-tables.service';
import { CreateDinamycTableDto } from './dto/create-dinamyc-table.dto';
import { UpdateDinamycTableDto } from './dto/update-dinamyc-table.dto';
import { AuthGuard } from '../guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('db')
export class DinamycTablesController {
  constructor(private readonly dinamycTablesService: DinamycTablesService) { }

  @Post(":table")
  async create(@Param("table") tableName: string, @Body() tableSchema: CreateDinamycTableDto) {
    return await this.dinamycTablesService.createTable(tableName, tableSchema);
  }
  @Get()
  findAll() {
    return this.dinamycTablesService.findAllTable();
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.dinamycTablesService.findOneTable(+id);
  }
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateDinamycTableDto: UpdateDinamycTableDto) {
    return await this.dinamycTablesService.updateTable(id, updateDinamycTableDto);
  }
  @Delete(':id')
  drop(@Param('id') id: number) {
    return this.dinamycTablesService.removeTable(id);
  }

  @Post("/:table/values")
  async insert(@Param("table") tableName: string, @Body() body: any) {
    return await this.dinamycTablesService.createValue(tableName, body);
  }
  @Get("/:table/values")
  async getAllValues(@Param("table") tableName: string) {
    const values = await this.dinamycTablesService.getAllValues(tableName);
    return values
  }
  @Patch('/:table/values/')
  async updateValue( @Param('table') table: string, @Body() body: any) {
    return await this.dinamycTablesService.updateTableValue(table, body);
  }
  @Delete('/:table/values/:id')
  async removeValue(@Param('table') tableName: string, @Param('id') id: number) {
    return await this.dinamycTablesService.removeTableValue(tableName, id);
  }
}
