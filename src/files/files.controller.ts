import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UpdateFolderDto } from './dto/update-files.dto';
import { AuthGuard } from '../guards/auth.guard';

interface renameBody{
  currentName:string,
  renamedFile: string
}
@UseGuards(AuthGuard)
@Controller('files')
export class FilesController {
  
  constructor(private readonly filesService: FilesService) {}
  @Get("subFolderFiles")
  async getAllFoldersFiles(){
    return await this.filesService.getAllSubFolderFiles()
  }
  @Get("/:dir")
  async allFiles(@Param("dir") dir:string){
    const folders = await this.filesService.getSubFolder(dir)
    const files = await this.filesService.getFiles(dir)
    return [folders? folders: [], files? files: []]
  }
  @Post("/folder/:dirName")
  async createFolder(@Body() body:UpdateFolderDto, @Param("dirName") dirName:string){
    if(body.name == ''){
      throw Error("Validation error: 'name' is not allowed to be empty")
    }
    const folder = await this.filesService.createFolder(dirName, body.name)
    return folder
  }
  @Post("/:dir")
  @UseInterceptors(
    FileInterceptor('uploadImage', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          const dir = req.params.dir;
          const uploadPath = `./public/${dir.replaceAll("-", "/")}`;
          callback(null, uploadPath);
        }, // Папка для сохранения загруженных файлов
        filename: async (req, file, callback) => {
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file,
    @Param("dir") dirName:string,
    @Body('fileResolution') fileResolution: string,
    @Body('fileSize') fileSize: number
  ) {
    return await this.filesService.saveFile(dirName, file.filename, fileResolution, fileSize, file.originalname);
  }
  @Patch("content/:dir/:fileName")
  async changeContent(
    @Param("dir") dirName:string,
    @Param("fileName") fileName:string,
    @Body() body:any
  ){
    return await this.filesService.changeFileCntent(dirName, fileName, body.content)
  }
  @Patch("/:dir") 
  async renameFile(@Body() body:renameBody ){
    return await this.filesService.renameFile(body.currentName, body.renamedFile)
  }
  @Delete("folder/:id")
  async deleteFolder(@Param("id") id:number){
    return await this.filesService.deleteFolder(id)
  }
  @Delete("/:dir/:id")
  async deleteFile(@Param("dir") dirName:string, @Param("id") id:number){
    return await this.filesService.deleteFile(dirName, id)
  }
}
