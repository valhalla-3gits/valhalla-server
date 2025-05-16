import { Model } from 'sequelize-typescript';
import { SearchQuery } from '../models/queries/searchQuery';

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export class SearchExtension<T extends Model> {
  db_result: T[];
  query: SearchQuery;

  constructor(db_result: T[], query: SearchQuery) {
    this.db_result = db_result;
    this.query = query;
  }
}
