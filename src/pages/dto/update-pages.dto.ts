import { IsString, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
class OptionsDto {
    @IsString()
    pagesName?: string;
  
    @IsString()
    pagesImg?: string;
  }
export class UpdatePagesDto {
    @IsNumber()
    id:number;

    @ValidateNested()
    @Type(() => OptionsDto)
    options?: OptionsDto;
}
