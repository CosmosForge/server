import { Column, Model, Table, Default } from "sequelize-typescript";

export enum columnType {
    string = 'STRING',
    text = 'TEXT',
    json = 'JSON',
    integer = 'INTEGER',
    float = 'FLOAT',
    double = 'DOUBLE',
    date = 'DATE',
    dateonly = 'DATEONLY',
    image = 'IMG'
}

export interface DinamicTablesEntity {
    fieldName: string;
    type: columnType;
}

export class DinamycTables {
    tableName?: string
    fields: DinamicTablesEntity[];
}
@Table
export class regTable extends Model {
  @Column
  tableName: string;

  @Default(0)
  @Column
  countValue: number;
  
  @Default(0)
  @Column
  countUpdated:number
}