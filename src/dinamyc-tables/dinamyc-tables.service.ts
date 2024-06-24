import { Injectable } from '@nestjs/common';
import { UpdateDinamycTableDto } from './dto/update-dinamyc-table.dto';
import { columnType, DinamycTables, regTable } from './entities/dinamyc-table.entity';
import { Sequelize } from 'sequelize-typescript';
import * as fs from "fs"
import { DATE, DATEONLY, DOUBLE, FLOAT, INTEGER, STRING, TEXT, JSON as JSONDB } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DinamycTablesService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(regTable)
    private readonly regTb: typeof regTable,
  ) { }
  private checkType(type: string) {
    switch (type) {
      case columnType.date:
        return [true, DATE]
      case columnType.dateonly:
        return [true, DATEONLY]
      case columnType.float:
        return [true, FLOAT]
      case columnType.double:
        return [true, DOUBLE]
      case columnType.integer:
        return [true, INTEGER]
      case columnType.json:
        return [true, JSONDB]
      case columnType.string:
        return [true, STRING]
      case columnType.image:
        return [true, STRING]
      case columnType.text:
        return [true, TEXT]
      default:
        return false
    }
  }
  private async initModel(name: string) {
    const tableSchema = JSON.parse(fs.readFileSync(process.cwd() + `/tables/${name}.json`, "utf8"));
    const tableFields = {};
    const modelsFields = [];

    for (const i of tableSchema.fields) {
      tableFields[i.fieldName] = this.checkType(i.type)[1];
    }
    let model
    if (this.sequelize.isDefined(tableSchema.tableName)) {
      model = this.sequelize.model(tableSchema.tableName)
      modelsFields.push(...Object.keys(model.rawAttributes)
        .filter(key => key !== "id" && key !== "createdAt" && key !== "updatedAt")
        .map(key => ({
          fieldName: key,
          type: model.rawAttributes[key].type.key
        })));
      if (JSON.stringify(tableSchema.fields) !== JSON.stringify(modelsFields)) {
        model = this.sequelize.define(tableSchema.tableName, tableFields, { freezeTableName: true });
        await model.sync({ alter: true });
      } else {
        await model.sync();
      }
    } else {
      model = this.sequelize.define(name, tableFields, { freezeTableName: true });
      await model.sync();
    }
    return model;
  }
  async createTable(tableName: string, dinamycDb: DinamycTables):Promise<{ status: boolean, regTable:regTable} | Error> {
    for (const i of dinamycDb.fields) {
      if (!this.checkType(i.type)[0]) {
        return Error("Failed to create table")
      }
    }
    const table = {
      tableName: tableName,
      fields: [
        ...dinamycDb.fields
      ]
    }
    await fs.writeFileSync(process.cwd() + `/tables/${tableName}.json`, JSON.stringify(table, null, 2));
    const model = await this.initModel(tableName)
    const regTable = await this.regTb.create({
      tableName: tableName,
      countValue: 0
    })
    return { status: true, regTable }
  }
  async findAllTable() {
    return await this.regTb.findAll()
  }
  async findOneTable(id: number) {
    const table = await this.regTb.findByPk(id)
    if (table) {
      const tableSchema = JSON.parse(fs.readFileSync(process.cwd() + `/tables/${table.tableName}.json`, "utf-8"));
      return tableSchema["fields"];
    }
  }
  async updateTable(id: number, updateDinamycTableDto: UpdateDinamycTableDto) {
    const table = await this.regTb.findByPk(id)
    if (table) {
      const tableSchema = JSON.parse(fs.readFileSync(process.cwd() + `/tables/${table.tableName}.json`, "utf-8"));
      tableSchema["fields"] = updateDinamycTableDto.fields;
      await fs.writeFileSync(process.cwd() + `/tables/${table.tableName}.json`, JSON.stringify(tableSchema, null, 2));
      this.initModel(table.tableName)
      return { status: true }
    }
    return { status: false }
  }
  async removeTable(id: number) {
    const table = await this.regTb.findByPk(id)
    if (table) {
      const model = await this.initModel(table.tableName)
      model.drop()
      await fs.unlinkSync(`${process.cwd()}/tables/${table.tableName}.json`)
      await table.destroy()
      return { status: true }
    }
    return { status: false }

  }

  async createValue(tableName: string, value: any) {
    const model = await this.initModel(tableName)
    return await model.create(value)
  }
  async getAllValues(tableName: string) {
    const model = await this.initModel(tableName)
    const tableValues = await model.findAll()
    const tableSchema = JSON.parse(fs.readFileSync(process.cwd() + `/tables/${tableName}.json`, "utf-8"));
    return [tableValues, tableSchema["fields"]]
  }
  async updateTableValue(tableName: string, body: any) {
    delete body.updatedAt
    delete body.createdAt
    const model = await this.initModel(tableName)
    const value = await model.findByPk(body.id)
    for (const key of Object.keys(body)) {
      if (key != "id") {
        value[key] = body[key]
      }
    }
    return await value.save()
  }
  async removeTableValue(tableName: string, id: number) {
    const model = await this.initModel(tableName)
    if(model){
      await model.destroy({ where: { id } })
      return {status: true}
    }
    return {status: false}
  }
}
