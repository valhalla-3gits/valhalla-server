import { IsNotEmpty } from 'class-validator';

export class TestCreateDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly test: string;

  @IsNotEmpty()
  readonly test_header: string;

  @IsNotEmpty()
  readonly test_result: string;
}
