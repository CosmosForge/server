import { IsArray, IsString } from "class-validator";


export class CreatePagesDto {
    @IsString()
    pagesName:string;
}
