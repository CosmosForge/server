import { IsArray, IsBoolean, IsNumber, IsString } from "class-validator";


export class CreateFilesDto {
    @IsString()
    aliasName: string;

    @IsString()
    fileName: string;
    
    @IsString()
    fileResolution?: string

    @IsNumber()
    fileSize: number
    
    @IsNumber()
    folderId: number; 
}
export class CreateFolderDto {
    @IsString()
    name: string;
    
    @IsBoolean()
    main?: boolean
}