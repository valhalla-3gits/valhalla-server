import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TESTS_REPOSITORY } from '../../../core/constants';
import { Test } from '../../../core/models/entities/tests.entity';
import { TestCreateDto } from '../../../core/models/dto/tests/testCreate.dto';
import { v4 } from 'uuid';

@Injectable()
export class TestsService {
  constructor(
    @Inject(TESTS_REPOSITORY) private readonly testsRepository: typeof Test,
  ) {}

  async createTest(task_id: number, test_create_model: TestCreateDto) {
    const test = await this.testsRepository.create(
      {
        token: v4(),
        name: test_create_model.name,
        test: test_create_model.test,
        test_header: test_create_model.test_header,
        test_result: test_create_model.test_result,
        task_id: task_id,
      } as Test,
      { include: { all: true } },
    );

    return test;
  }

  async deleteTest(id: number): Promise<void> {
    const test = await this.testsRepository.findByPk(id);

    if (!test) {
      throw new NotFoundException(`Test with id ${id} not found`);
    }

    await test.destroy();
  }
}
