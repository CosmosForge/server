import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("images/:party")
  async sendPartyImages(@Param("party") party):Promise<string[]> {
    const files = await this.appService.getPartyImages(parseInt(party))
    return files
  }
  @Post("image")
  @UseInterceptors(
    FileInterceptor('uploadImage', {
      storage: diskStorage({
        destination: './public/imgs', // Папка для сохранения загруженных файлов
        filename: (req, file, callback) => {
          const currentDate = new Date();
          const formattedDate = currentDate.toISOString().replace(/:/g, '-').substring(0, 19);
          const randomName = Array(32).fill(null).map(() => Math.round(Math.random() * 16).toString(16)).join('');
          return callback(null, `${formattedDate+"-"+randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file) {
    return { filename: file.filename };
  }
}
