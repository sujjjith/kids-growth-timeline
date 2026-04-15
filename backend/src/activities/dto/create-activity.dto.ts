import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  activityName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  activityType: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  provider?: string;

  @IsNotEmpty()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  dayOfWeek?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
