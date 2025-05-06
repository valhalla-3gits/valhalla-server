import { IsNotEmpty, IsOptional } from 'class-validator';

export class TestUpdateDto {
  @IsOptional()
  readonly token?: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly test: string;

  @IsNotEmpty()
  readonly test_header: string;

  @IsNotEmpty()
  readonly test_result: string;
}
