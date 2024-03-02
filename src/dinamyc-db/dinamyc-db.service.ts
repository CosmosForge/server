import { Injectable } from '@nestjs/common';
import { CreateDinamycDbDto } from './dto/create-dinamyc-db.dto';
import { UpdateDinamycDbDto } from './dto/update-dinamyc-db.dto';
import { Sequelize } from 'sequelize-typescript';
import * as fs from "fs"
import * as argon2 from "argon2";
import { STRING, INTEGER, DATE, DATEONLY, TEXT, FLOAT, JSON as JSONDB} from 'sequelize';
import { DinamycDb, columnType } from './entities/dinamyc-db.entity';

@Injectable()
export class DinamycDbService {
  constructor(private sequelize: Sequelize) {}
  private async dynamicModel(path) {
    const tableSchema = JSON.parse(fs.readFileSync(process.cwd() + `\\dynamicDB\\${path}.DB.json`, "utf8"));
    const tableFields = {};
    const modelsFields = [];
  
    for (const i of tableSchema.fields) {
      tableFields[i.fieldName] = this.checkType(i.type)[1];
    }

    let model 
    if(this.sequelize.isDefined(path)){
      model = this.sequelize.model(tableSchema.tableName)
      modelsFields.push(...Object.keys(model.rawAttributes)
      .filter(key => key !== "id" && key !== "createdAt" && key !== "updatedAt")
      .map(key => ({
        fieldName: key,
        type: model.rawAttributes[key].type.key
      })));
    }else{
      model = this.sequelize.define(path, tableFields);
    }
    if (JSON.stringify(tableSchema.fields) !== JSON.stringify(modelsFields)) {
      model = this.sequelize.define(tableSchema.tableName, tableFields);
      await model.sync({ alter: true });
    } else {
      await model.sync();
    }
    return model;
  }
  async createDB(tableName:string, dinamycDb:DinamycDb) {
    for(const i of dinamycDb.fields){
      if(!this.checkType(i.type)[0]){
        return {status: 0}
      }
    }
    const table:DinamycDb = {
      tableName: tableName,
      fields:[
        ...dinamycDb.fields
      ]
    }
    fs.writeFile(process.cwd() + `\\dynamicDB\\${tableName}.DB.json`, JSON.stringify(table, null, 2), async (err)=>{
      if (err) {
        console.error(err);
        return;
      }
      const model = await this.dynamicModel(tableName)
      return {status:1}
    });
  }
  private checkType(type:string){
    switch (type) {
      case columnType.date:
        return [true, DATE]
      case columnType.dateonly:
        return [true, DATEONLY]
      case columnType.float:
        return [true, FLOAT]
      case columnType.integer:
        return [true, INTEGER]
      case columnType.json:
        return [true, JSONDB]
      case columnType.string:
        return [true, STRING]
        case columnType.text:
          return [true, TEXT]
      default:
        return false
    }
  }
  async create(tableName:string, createDinamycDbDto:CreateDinamycDbDto) {
    const model = await this.dynamicModel(tableName)
    const createFields = {}
    for(const i of createDinamycDbDto.fields){
      if(i.name == "password"){
        const hash = await argon2.hash("password");
        createFields[i.name] = hash
      }else{
        createFields[i.name] = i.value
      }
    }
    return model.create(createFields)
  }

  async findAll(tableName:string, where:{} = {}):Promise<any[]> {
    const model = await this.dynamicModel(tableName)
    return model.findAll({where:where})
  }
  async findOne(tableName:string, where:{}) {
    const model = await this.dynamicModel(tableName)
    return model.findAll({where:where})
  }
  async findById(tableName:string, id: number) {
    const model = await this.dynamicModel(tableName)
    return model.findAll({where:{id:id}})
  }

  async update(tableName:string, id: number, updateDinamycDbDto:UpdateDinamycDbDto) {
    const model = await this.dynamicModel(tableName)
    const updateFields = {}
    for(const i of updateDinamycDbDto.fields){
      if(i.name == "password"){
        const hash = await argon2.hash("password");
        updateFields[i.name] = hash
      }else{
        updateFields[i.name] = i.value
      }
    }
    return await model.update(updateFields, {
      where: {
        id: id,
      },
      returning: true,
    });
  }

  async remove(tableName:string, id: number) {
    const model = await this.dynamicModel(tableName)
    await model.destroy({where:{id:id}})
  }

  async drop(tableName:string) {
    const model = await this.dynamicModel(tableName)
    await model.drop()
    fs.unlink(process.cwd() + `\\dynamicDB\\${tableName}.DB.json`, (err)=>{
      if (err) {
        console.error(err);
        return;
      }
      return {status: 1}
    })
  }
}
