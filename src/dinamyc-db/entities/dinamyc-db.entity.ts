export enum columnType {
    string = 'STRING',
    text = 'TEXT',
    json = 'JSON',
    integer = 'INTEGER',
    float = 'FLOAT',
    date = 'DATE',
    dateonly = 'DATEONLY'
}

export interface DinamicDBEntity {
    fieldName: string;
    type: columnType;
}

export class DinamycDb {
    tableName?: string
    fields: DinamicDBEntity[];
}