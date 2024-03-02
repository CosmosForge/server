import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { PagesService } from './pages.service';
import { Pages } from './entities/pages.entity';
import { CreatePagesDto } from './dto/create-pages.dto';
import { UpdatePagesDto } from './dto/update-pages.dto';
interface snapshot{
  path:string
}

@Controller('pages')
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    ) {}
  
  @Post()
  async create(@Body() page:CreatePagesDto):Promise<Pages>{
    return await this.pagesService.create(page.pagesName)
  }
  @Get()
  async all():Promise<Pages[]>{
    console.log()
    return await this.pagesService.findAll()
  }
  @Get("/:id")
  async byId(@Param("id") id:string):Promise<Pages>{
    
    return await this.pagesService.findById(parseInt(id))
  }
  @Patch()
  async update(@Body() page:UpdatePagesDto){
    return await this.pagesService.update(page.id, page.options)
  }

  @Get("schema/:schema")
  async sendPagesList(@Param("schema") shema:string){
    const schema = await this.pagesService.getPageSchema(shema);
    return schema
  }
  @Patch("/snapshot/:id")
  async createShapshot(@Body() url:snapshot, @Param("id") id:string, @Req() request: Request){
    return await this.pagesService.createPageSnapshot(url.path, parseInt(id), request.protocol+"://"+request.get('Host'))
  }
}
