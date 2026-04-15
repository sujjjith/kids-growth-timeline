import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateCompetitionDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  competitionName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  competitionType?: string;

  @IsNotEmpty()
  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  result?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  placement?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
