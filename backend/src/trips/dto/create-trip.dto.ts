import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsIn,
  IsUUID,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsIn(['Family', 'Individual'])
  tripType: string;

  @ValidateIf((o) => o.tripType === 'Individual')
  @IsNotEmpty({ message: 'kidId is required for Individual trips' })
  @IsUUID()
  kidId?: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  tripName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  destination: string;

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
