import { SearchExtension } from './SearchExtension';
import { Task } from '../models/entities/task.entity';
import Fuse from 'fuse.js';

export class TaskSearchExtension extends SearchExtension<Task> {
  filter() {
    this.db_result = this.db_result.filter(
      (task) => task.rank.token in this.query.filter,
    );

    return this;
  }

  search() {
    const fuse_options = {
      includeScore: true,
      keys: ['name'],
    };

    const fuse = new Fuse(this.db_result, fuse_options);

    const result = fuse.search(this.query.search_string);
    const result_sorted = result.sort((a, b) => b.score! - a.score!);
    this.db_result = result_sorted.map((fuseResult) => fuseResult.item);

    return this;
  }
}
