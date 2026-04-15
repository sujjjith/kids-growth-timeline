import {
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
  IsString,
} from 'class-validator';

export class CreateGrowthDto {
  @IsNotEmpty()
  @IsDateString()
  measurementDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  heightInches?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  weightLbs?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
