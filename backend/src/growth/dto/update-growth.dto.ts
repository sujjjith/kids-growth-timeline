import { PartialType } from '@nestjs/mapped-types';
import { CreateGrowthDto } from './create-growth.dto';

export class UpdateGrowthDto extends PartialType(CreateGrowthDto) {}
