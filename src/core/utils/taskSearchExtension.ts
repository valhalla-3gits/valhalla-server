import { SearchExtension } from './SearchExtension';
import { Task } from '../models/entities/task.entity';
import Fuse from 'fuse.js';

export class TaskSearchExtension extends SearchExtension<Task> {
  filter() {
    // Filter by rank if rank_filter is provided
    if (this.query.rank_filter && this.query.rank_filter.length > 0) {
      this.db_result = this.db_result.filter(
        (task) => task.rank && this.query.rank_filter.includes(task.rank.token),
      );
    }

    // Filter by language if language_filter is provided
    if (this.query.language_filter && this.query.language_filter.length > 0) {
      this.db_result = this.db_result.filter(
        (task) => task.language && this.query.language_filter.includes(task.language.token),
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
    const result_sorted = result.sort((a, b) => (a.score || 1) - (b.score || 1)); // Sort by score (lower is better)
    this.db_result = result_sorted.map((fuseResult) => fuseResult.item);

    return this;
  }

  paginate() {
    const page = this.query.page || 1;
    const limit = this.query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    this.db_result = this.db_result.slice(startIndex, endIndex);

    return this;
  }
}
