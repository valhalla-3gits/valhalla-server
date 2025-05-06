import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TESTS_REPOSITORY } from '../../../core/constants';
import { Test } from '../../../core/models/entities/tests.entity';
import { TestCreateDto } from '../../../core/models/dto/tests/testCreate.dto';
import { TestUpdateDto } from '../../../core/models/dto/tests/testUpdate.dto';
import { v4 } from 'uuid';
import { TestResponseDto } from '../../../core/models/dto/tests/testResponse.dto';
import { TaskAnswerDto } from '../../../core/models/dto/tasks/taskAnswer.dto';
import { RceEngineService } from '../rce-engine/rce-engine.service';
import { Language } from '../../../core/models/entities/language.entity';

@Injectable()
export class TestsService {
  constructor(
    @Inject(TESTS_REPOSITORY) private readonly testsRepository: typeof Test,
    private readonly rceEngineService: RceEngineService,
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

  async updateTest(task_id: number, test_update_model: TestUpdateDto) {
    // If token is provided and not empty, try to find and update the existing test
    if (test_update_model.token && test_update_model.token.trim() !== '') {
      const existingTest = await this.testsRepository.findOne({
        where: {
          token: test_update_model.token,
        },
      });

      if (existingTest) {
        // Update the existing test
        await existingTest.update({
          name: test_update_model.name,
          test: test_update_model.test,
          test_header: test_update_model.test_header,
          test_result: test_update_model.test_result,
          task_id: task_id,
        });

        return existingTest;
      }
    }

    // If no token provided, empty token, or no test found with the given token, create a new test
    const test = await this.testsRepository.create(
      {
        token: v4(),
        name: test_update_model.name,
        test: test_update_model.test,
        test_header: test_update_model.test_header,
        test_result: test_update_model.test_result,
        task_id: task_id,
      } as Test,
      { include: { all: true } },
    );

    return test;
  }

  async executeTest(
    answer: TaskAnswerDto,
    test: Test,
    language: Language,
  ): Promise<TestResponseDto> {
    const code = test.test_header + '\n' + answer.answer + '\n' + test.test;
    const output: TestResponseDto = await this.rceEngineService.run(
      language.token,
      code,
    );
    return output;
  }
}
