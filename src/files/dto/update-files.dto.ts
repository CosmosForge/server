import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateFileDto {
  @IsNumber()
  id?: number
  @IsString()
  aliasName?: string;
}
export class UpdateFolderDto {
  @IsNumber()
  id?: number
  @IsString()
  name?: string;
}