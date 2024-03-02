import { PartialType } from '@nestjs/mapped-types';
import { CreateDinamycDbDto } from './create-dinamyc-db.dto';
import { IsArray, IsString } from 'class-validator';

export class UpdateDinamycDbDto extends PartialType(CreateDinamycDbDto) {
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
