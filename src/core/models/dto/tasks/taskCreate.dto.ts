import { IsNotEmpty } from 'class-validator';
import { TestCreateDto } from '../tests/testCreate.dto';

export class TaskCreateDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly rank_id: string;

  @IsNotEmpty()
  readonly tests: TestCreateDto[];

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly prototype: string;

  @IsNotEmpty()
  readonly output_examples: string;

  @IsNotEmpty()
  readonly language_id: string;
}
