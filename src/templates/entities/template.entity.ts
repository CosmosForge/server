import { Column, Model, Table } from "sequelize-typescript";

@Table
export class Template extends Model {
    @Column
    name:string
}
