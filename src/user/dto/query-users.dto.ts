import { IsBooleanString, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryUsersDto {
  @IsOptional() @IsString()
  q?: string; // name/email

  @IsOptional() @IsBooleanString()
  includeInactive?: string; // 'true' | 'false'

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  page?: number;

  @IsOptional() @Type(() => Number) @IsInt() @Min(1)
  limit?: number;
}
