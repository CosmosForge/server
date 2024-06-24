import { DinamicTablesEntity } from "../entities/dinamyc-table.entity";

export class CreateDinamycTableDto {
    tableName?: string
    fields: DinamicTablesEntity[];
}
