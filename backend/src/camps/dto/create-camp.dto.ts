import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateCampDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  campName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  campType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  highlights?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
