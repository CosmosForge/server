import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Logger extends Model {
  @Column
  url: string;

  @Column
  method: string;
}
