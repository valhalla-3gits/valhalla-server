import { IsNotEmpty } from 'class-validator';

export class TaskAnswerDto {
  @IsNotEmpty()
  readonly answer: string;
}