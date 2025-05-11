import { TestDto } from '../tests/test.dto';
import { RankDto } from '../ranks/rank.dto';
import { LanguageDto } from '../languages/language.dto';
import { Task } from '../../entities/task.entity';

export class TaskDto {
  constructor(task: Task) {
    this.token = task.token;
    this.name = task.name;
    this.description = task.description;
    this.prototype = task.prototype;
    this.author_token = task.author.token;
    this.rank = new RankDto(task.rank);
    this.language = new LanguageDto(task.language);
    this.tests = task.tests?.map((test) => new TestDto(test)) ?? [];
    this.is_favourite = false;
  }

  readonly token: string;

  readonly name: string;

  readonly description: string;

  readonly prototype: string;

  readonly tests: TestDto[];

  readonly author_token: string;

  readonly language: LanguageDto;

  readonly rank: RankDto;

  is_favourite: boolean;
}
