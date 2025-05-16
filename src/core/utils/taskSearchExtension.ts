import { SearchExtension } from './SearchExtension';
import { Task } from '../models/entities/task.entity';
import Fuse from 'fuse.js';
import { SearchType, SortField } from '../models/queries/searchQuery';

export class TaskSearchExtension extends SearchExtension<Task> {
  hasMore: boolean = false;

  filter() {
    // Filter by rank if rank_filter is provided
    if (this.query.rank_filter !== null) {
      this.db_result = this.db_result.filter(
        (task) => task.rank && task.rankId === this.query.rank_filter,
      );
    }

    // Filter by language if language_filter is provided
    if (this.query.language_filter !== null) {
      this.db_result = this.db_result.filter(
        (task) =>
          task.language && task.languageId === this.query.language_filter,
      );
    }

    return this;
  }

  search() {
    if (!this.query.search_string || this.query.search_string === '') {
      return this;
    }

    const fuse_options = {
      includeScore: true,
      keys: ['name'],
      threshold: 0.4, // Lower threshold for more fuzzy matching
    };

    const fuse = new Fuse(this.db_result, fuse_options);

    const result = fuse.search(this.query.search_string);
    const result_sorted = result.sort(
      (a, b) => (a.score || 1) - (b.score || 1),
    ); // Sort by score (lower is better)
    this.db_result = result_sorted.map((fuseResult) => fuseResult.item);

    return this;
  }

  sort() {
    const sortBy = this.query.sort_by || SortField.NEWEST;

    this.db_result = this.db_result.sort((a, b) => {
      let valueA, valueB;

      // Get the values to compare based on the sort field
      if (sortBy === SortField.NAME_ASC || sortBy === SortField.NAME_DESC) {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      } else {
        // Default to createdAt
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
      }

      // Sort based on the direction
      if (sortBy === SortField.NEWEST || sortBy === SortField.NAME_ASC) {
        return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
      } else {
        // Default to DESC
        return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
      }
    });

    return this;
  }

  paginate() {
    const page = this.query.page || 1;
    const limit = this.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Check if there are more results beyond the current page
    this.hasMore = this.db_result.length > endIndex;

    // Slice the results for the current page
    this.db_result = this.db_result.slice(startIndex, endIndex);

    return this;
  }
}
