import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { PagesService } from './pages.service';
import { CreatePagesDto } from './dto/create-pages.dto';
import { UpdatePagesDto } from './dto/update-pages.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Public } from '../decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('pages')
export class PagesController {
  constructor(
    private readonly pagesService: PagesService,
    ) {}
  
  @Post()
  async create(@Body() page:CreatePagesDto){
    return await this.pagesService.create(page.pageName.toLowerCase())
  }
  @Get("count")
  async count(){
    return await this.pagesService.findCount()
  }
  @Get()
  async all(){
    return await this.pagesService.findAll()
  }
  @Public()
  @Get("schema/main")
  async sendMainSchema(){
    const schema = await this.pagesService.getGlobalSchema("main");
    return schema
  }
  @Public()
  @Get("schema/header")
  async sendHeaderSchema(){
    const schema = await this.pagesService.getGlobalSchema("header");
    return schema
  }
  @Public()
  @Get("schema/footer")
  async sendFooterSchema(){
    const schema = await this.pagesService.getGlobalSchema("footer");
    return schema
  }
  @Get("schema/:id")
  async sendPagesSchema(@Param("id") id:number){
    const pageSchema = await this.pagesService.getPageSchema(id);
    return pageSchema
  }
  @Public()
  @Get("guest-schema/:id")
  async sendGuestPagesSchema(@Param("id") schema:string){
    const guestSchema = await this.pagesService.getGuestPageSchema(schema);
    return guestSchema
  }
  @Get("/:id")
  async byId(@Param("id") id:number){
    return await this.pagesService.findById(id)
  }
  @Patch("schema/main")
  async updateMainSchema(@Body() schema:any){
    const mainSchema = await this.pagesService.updateGlobalSchema("main",schema)
    return mainSchema
  }
  @Patch("schema/header")
  async updateHeaderSchema(@Body() schema:any){
    const headerSchema = await this.pagesService.updateGlobalSchema("header",schema)
    return headerSchema
  }
  @Patch("schema/footer")
  async updateFooterSchema(@Body() schema:any){
    const pageSchema = await this.pagesService.updateGlobalSchema("footer",schema)
    return pageSchema
  }
  @Patch("schema/:id")
  async updatePagesSchema(@Param("id") id:number, @Body() schema:any){
    const pageSchema = await this.pagesService.updatePageSchema(id, schema)
    return pageSchema
  }
  @Patch("/snapshot/:id")
  async createSnapshot(@Body() body:any, @Param("id") id:string, @Req() request: Request){
    return await this.pagesService.createPageSnapshot(body.url, parseInt(id), request.protocol+"://"+request.get('Host'))
  }
  @Patch()
  async update(@Body() page:UpdatePagesDto){
    return await this.pagesService.update(page.id, page.options)
  }
  @Delete(":id")
  async delete(@Param("id") id:number){
    return await this.pagesService.delete(id)
  }
}
