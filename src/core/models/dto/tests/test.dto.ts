import { Test } from '../../entities/tests.entity';

export class TestDto {
  constructor(test: Test) {
    this.token = test.token;
    this.name = test.name;
    this.test = test.test;
    this.test_header = test.test_header;
    this.test_result = test.test_result;
  }

  readonly token: string;
  readonly name: string;
  readonly test: string;
  readonly test_header: string;
  readonly test_result: string;
}
