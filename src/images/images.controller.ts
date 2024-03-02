import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImagesService } from './images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
@Controller("/images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Get(":party")//выдача URL адресов по партиям
  async sendPartyImages(@Param("party") party):Promise<string[]> {
    const files = await this.imagesService.getPartyImages(parseInt(party))
    return files
  }
  @Post("")
  @UseInterceptors(
    FileInterceptor('uploadImage', {
      storage: diskStorage({
        destination: './public/imgs/uploads', // Папка для сохранения загруженных файлов
        filename: (req, file, callback) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().replace(/:/g, '-').substring(0, 19);
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          return callback(null, `${formattedDate+"-"+randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file) {//загруска картинки с фронта
    return { filename: file.filename };
  }
}
