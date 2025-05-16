import { Transform, Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

// Define valid sort fields
export enum SortField {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  NAME_ASC = 'name_asc',
  NAME_DESC = 'name_desc',
}

// Define search types
export enum SearchType {
  ALL = 'all',
  FAVORITES = 'favorites',
  SOLVED = 'solved',
}

export class SearchQuery {
  @IsOptional()
  @IsString()
  search_string: string = '';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return value ? Number(value) : null;
  })
  rank_filter: number | null = null;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => {
    return value ? Number(value) : null;
  })
  language_filter: number | null = null;

  @IsOptional()
  @IsEnum(SearchType)
  @Transform(({ value }) => {
    // Default to ALL if not provided or invalid
    if (!value || !Object.values(SearchType).includes(value as SearchType)) {
      return SearchType.ALL;
    }
    return value;
  })
  search_type: SearchType = SearchType.ALL;

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

  @IsOptional()
  @IsEnum(SortField)
  @Transform(({ value }) => {
    // Default to createdAt if not provided or invalid
    if (!value || !Object.values(SortField).includes(value as SortField)) {
      return SortField.NEWEST;
    }
    return value;
  })
  sort_by: SortField = SortField.NEWEST;
}
