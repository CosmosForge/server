import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Template } from './entities/template.entity';
import * as fs from "fs"
@Injectable()
export class TemplatesService {
  constructor(
    @InjectModel(Template)
    private readonly template: typeof Template,
  ) { }
  async create(createTemplateDto: CreateTemplateDto) {
    const template = await this.template.findOne({ where: { name: createTemplateDto.name.toLowerCase() } })
    if (!template) {
      fs.writeFileSync(process.cwd() + `/schemas/templates/${createTemplateDto.name}.json`, JSON.stringify(
        {
          body: {
            main: {
              update: false,
              children: [],
              html: ""
            }
          }
        }, null, 2)
      )
      return await this.template.create({ name: createTemplateDto.name.toLowerCase() })
    } else {
      return null
    }
  }
  async findCount() {
    return await this.template.count()
  }
  async findAll() {
    return await this.template.findAll()
  }
  async findById(id:number){
    return await this.template.findByPk(id)
  }
  async findSchemaOne(id: number) {
    try {
      const template = await this.template.findByPk(id)
      return await fs.promises.readFile(process.cwd() + `/schemas/templates/${template.name.toLowerCase()}.json`, "utf8")
    } catch (error) {
      return null
    }
  }

  async update(id: number, schema: any) {
    const template = await this.template.findByPk(id)
    fs.writeFileSync(process.cwd() + `/schemas/templates/${template.name}.json`, JSON.stringify(schema, null, 2))
    return await fs.promises.readFile(process.cwd() + `/schemas/templates/${template.name}.json`, "utf8")
  }

  async remove(id: number) {
    const template = await this.template.findByPk(id)
    if(template){
      fs.unlinkSync(process.cwd() + `/schemas/templates/${template.name}.json`)
      return await template.destroy()
    }
    throw Error("Template does not exist")
  }
}
