import { IsArray, IsString } from "class-validator";


export class CreateDinamycDbDto {
    @IsString()
    tableName?:string;
    
    @IsArray()
    fields:[
        {
            name:string,
            value:any
        }
    ];
}
