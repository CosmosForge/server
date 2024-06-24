import { Column, Default, Model, Table } from "sequelize-typescript";

@Table
export class User extends Model{
    @Column
    name:string

    @Column
    email:string

    @Column
    password:string

    @Column
    first_name?:string

    @Column
    last_name?:string

    @Column
    phone?:string

    @Column
    facebook_link?:string

    @Column
    instagramm_link?:string

    @Column
    github_link?:string

    @Column
    itchio_link?:string

    @Column
    google_link?:string
    
    @Default(false)
    @Column
    role:boolean

    @Column
    imgPath?:string
}
