import { Table, Column, Model, ForeignKey, BelongsTo, Default, HasMany } from 'sequelize-typescript';

@Table
export class Folder extends Model {
  @Column
  name: string;
  
  @Default(false)
  @Column
  main: boolean

  @HasMany(() => File)
  files: File[]
}

@Table
export class File extends Model {
  @Column
  aliasName: string;

  @Column
  fileName: string;
  
  @Column
  fileResolution?: string

  @Column
  fileSize: number
  
  @ForeignKey(() => Folder)
  @Column
  folderId: number; 
}
