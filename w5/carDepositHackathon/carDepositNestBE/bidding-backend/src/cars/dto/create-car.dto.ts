import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateCarDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsString() make: string;
  @IsNotEmpty() @IsString() model: string;
  @IsNotEmpty() @Type(() => Number) @IsNumber() year: number;
  @IsNotEmpty() @Type(() => Number) @IsNumber() price: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsArray() image: string;
  @IsNotEmpty() @IsString() category: string;
}
