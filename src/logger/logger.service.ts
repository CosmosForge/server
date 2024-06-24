import { Injectable } from '@nestjs/common';
import { Logger } from './entities/logger.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(Logger)
    private readonly logger: typeof Logger,
  ) { }
  async create(url: string, method: string) {
    if (method == "GET" && !url.includes("count") && !url.includes("static")) {
      if(url.includes("db")){
        url = "db"
      }else if(url.includes("files")){
        url = "files"
      }else if(url.includes("pages")){
        if(url == "/pages/"){
          url = "pages"
        }else if(url.includes("/schema/")){
          const urlParts = url.split("/").filter(value=>value!="")
          const numb = urlParts.pop()
          if(!isNaN(parseInt(numb))){
            url = `pages/${numb}/constructor`
          }else{
            if(numb == "main"){
              url = "head"
            }else{
              url = "head-foot"
            }
          }
        }else{
          const urlParts = url.split("/").filter(value=>value!="")
          const numb = urlParts.pop()
          if(!isNaN(Number(numb))){
            url = `pages/${numb}`
          }
        }
      }else if(url.includes("templates")){
        if(url == "/templates"){
          url = "templates"
        }else{
          const urlParts = url.split("/").filter(value=>value!="")
          const numb = urlParts.pop()
          if(!isNaN(Number(numb))){
            url = `templates/${numb}`
          }
        }
      }
      else if(url.includes("users")){
        url = "user"
      }
      if(!url.includes("logger")){
        const record = await this.logger.findOne({ where: { url, method } })
        if (record) {
          await record.save({silent:true})
        } else {
          const count = await this.logger.count()
          if(count < 6){
            await this.logger.create({ url, method })
          }else{
            const latestRecord = await this.logger.findOne({
              order: [['updatedAt', 'ASC']]
            });
            latestRecord.url = url
            latestRecord.method = method
            await latestRecord.save()
          }
        }
      }
    }
  }

  async findAll() {
    return await this.logger.findAll({order: [['updatedAt', 'DESC']]})
  }
}
