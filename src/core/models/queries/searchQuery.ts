import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SearchQuery {
  @IsOptional()
  @IsString()
  search_string: string = '';

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    // Handle both string and array formats
    if (typeof value === 'string') {
      return value.split(',').filter(Boolean);
    }
    return value || [];
  })
  rank_filter: string[] = [];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    // Handle both string and array formats
    if (typeof value === 'string') {
      return value.split(',').filter(Boolean);
    }
    return value || [];
  })
  language_filter: string[] = [];

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number = 10;
}
