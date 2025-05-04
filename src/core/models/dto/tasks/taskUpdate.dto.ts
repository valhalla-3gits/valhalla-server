import { IsNotEmpty } from 'class-validator';
import { TestUpdateDto } from '../tests/testUpdate.dto';

export class TaskUpdateDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly rank_uuid: string;

  @IsNotEmpty()
  readonly tests: TestUpdateDto[];

  @IsNotEmpty()
  readonly description: string;

  @IsNotEmpty()
  readonly output_examples: string;

  @IsNotEmpty()
  readonly language_uuid: string;

  @IsNotEmpty()
  readonly prototype: string;
}
