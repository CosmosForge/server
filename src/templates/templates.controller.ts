import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { AuthGuard } from '../guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Post()
  async create(@Body() createTemplateDto: CreateTemplateDto) {
    return await this.templatesService.create(createTemplateDto);
  }
  @Get("count")
  async findCount() {
    return await this.templatesService.findCount();
  }
  @Get()
  async findAll() {
    return await this.templatesService.findAll();
  }

  @Get('schema/:id')
  async findOne(@Param('id') id: number) {
    return await this.templatesService.findSchemaOne(id);
  }
  @Get("/:id")
  async byId(@Param("id") id:number){
    return await this.templatesService.findById(id)
  }
  @Patch('schema/:id')
  update(@Param('id') id: number, @Body() schema: any) {
    
    return this.templatesService.update(id, schema);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    
    return await this.templatesService.remove(id);
  }
}
