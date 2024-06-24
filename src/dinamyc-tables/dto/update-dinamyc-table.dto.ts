import { PartialType } from '@nestjs/mapped-types';
import { CreateDinamycTableDto } from './create-dinamyc-table.dto';

export class UpdateDinamycTableDto extends PartialType(CreateDinamycTableDto) {}
