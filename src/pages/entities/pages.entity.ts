import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class Pages extends Model {
  @Column
  pageName: string;

  @Column
  pageImg: string;
  
  @Column
  popular:number;
  
}