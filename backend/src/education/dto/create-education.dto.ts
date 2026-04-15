import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateEducationDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  schoolName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  grade?: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  achievement?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}
