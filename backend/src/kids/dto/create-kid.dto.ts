import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateKidDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsNotEmpty()
  @IsIn(['Male', 'Female', 'Other'])
  gender: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  nickname?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
