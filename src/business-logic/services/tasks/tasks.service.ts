import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  FAVOURITE_TASKS_REPOSITORY,
  SOLVED_TASKS_REPOSITORY,
  TASKS_REPOSITORY,
} from '../../../core/constants';
import { Task } from '../../../core/models/entities/task.entity';
import { SearchQuery } from '../../../core/models/queries/searchQuery';
import { TaskSearchExtension } from '../../../core/utils/taskSearchExtension';
import { TaskCreateDto } from '../../../core/models/dto/tasks/taskCreate.dto';
import { v4 as uuidv4 } from 'uuid';
import { RanksService } from '../ranks/ranks.service';
import { LanguagesService } from '../languages/languages.service';
import { TestsService } from '../tests/tests.service';
import { Test } from '@nestjs/testing';
import { TaskDto } from '../../../core/models/dto/tasks/task.dto';
import { TaskUpdateDto } from '../../../core/models/dto/tasks/taskUpdate.dto';
import { TaskAnswerDto } from '../../../core/models/dto/tasks/taskAnswer.dto';
import { TestResultDto } from 'src/core/models/dto/tests/testResult.dto';
import { SolvedTask } from '../../../core/models/entities/solvedTask.entity';
import { FavouriteTask } from '../../../core/models/entities/favouriteTask.entity';
import { User } from 'src/core/models/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY) private readonly tasksRepository: typeof Task,
    @Inject(SOLVED_TASKS_REPOSITORY)
    private readonly solvedTasksRepository: typeof SolvedTask,
    @Inject(FAVOURITE_TASKS_REPOSITORY)
    private readonly favouriteTasksRepository: typeof FavouriteTask,
    private readonly ranksService: RanksService,
    private readonly languagesService: LanguagesService,
    private readonly testsService: TestsService,
    private readonly usersService: UsersService,
  ) {}

  async getTasks(): Promise<TaskDto[]> {
    const tasks: Task[] = await this.tasksRepository.findAll();
    const task_models = tasks.map((task) => new TaskDto(task));

    return task_models;
  }

  async searchTasks(query: SearchQuery): Promise<TaskDto[]> {
    const search_result = new TaskSearchExtension(
      await this.tasksRepository.findAll(),
      query,
    )
      .filter()
      .search();

    const tasks = search_result.db_result;
    const task_models = tasks.map((task) => new TaskDto(task));

    return task_models;
  }

  async createTask(
    createModel: TaskCreateDto,
    author_id: number,
  ): Promise<TaskDto> {
    const rank = await this.ranksService.getRankByToken(createModel.rank_uuid);
    const language = await this.languagesService.getLanguageByToken(
      createModel.language_uuid,
    );

    let task: Task | null = await this.tasksRepository.create<Task>(
      {
        token: uuidv4(),
        rankId: rank.id,
        name: createModel.name,
        description: createModel.description,
        authorId: author_id,
        languageId: language.id,
        prototype: createModel.prototype,
      } as Task,
      { include: { all: true } },
    );

    if (!task) {
      throw new InternalServerErrorException(
        'Error while creating new tasks occured.',
      );
    }

    const tests: Test[] = [];
    for (const test of createModel.tests) {
      const created_test = await this.testsService.createTest(task.id, test);
      tests.push(created_test);
    }

    task = await this.tasksRepository.findOne({
      where: {
        id: task.id,
      },
    });

    if (!task) {
      throw new InternalServerErrorException(
        'Error while creating new tasks occured.',
      );
    }

    const task_model = new TaskDto(task);

    return task_model;
  }

  async getTaskByToken(token: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: {
        token: token,
      },
      include: {
        all: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found by the token.');
    }

    return task;
  }

  async updateTask(
    token: string,
    updateModel: TaskUpdateDto,
  ): Promise<TaskDto> {
    // Find the task by token
    const task = await this.tasksRepository.findOne({
      where: {
        token: token,
      },
      include: {
        all: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found by the token.');
    }

    // Get the rank and language by their tokens
    const rank = await this.ranksService.getRankByToken(updateModel.rank_uuid);
    const language = await this.languagesService.getLanguageByToken(
      updateModel.language_uuid,
    );

    // Update the task
    await task.update({
      name: updateModel.name,
      description: updateModel.description,
      prototype: updateModel.prototype,
      rankId: rank.id,
      languageId: language.id,
    });

    // Keep track of existing test tokens and which ones are updated
    const updatedTestTokens = updateModel.tests
      .filter((test) => test.token)
      .map((test) => test.token);

    // Update or create tests
    for (const test of updateModel.tests) {
      await this.testsService.updateTest(task.id, test);
    }

    // Delete tests that are no longer in the update model
    if (task.tests) {
      for (const test of task.tests) {
        if (!updatedTestTokens.includes(test.token)) {
          await this.testsService.deleteTest(test.id);
        }
      }
    }

    // Fetch the updated task with all relations
    const updatedTask = await this.tasksRepository.findOne({
      where: {
        token: token,
      },
      include: {
        all: true,
      },
    });

    if (!updatedTask) {
      throw new InternalServerErrorException(
        'Error while updating task occurred.',
      );
    }

    return new TaskDto(updatedTask);
  }

  async deleteTask(token: string): Promise<void> {
    // Find the task by token
    const task = await this.tasksRepository.findOne({
      where: {
        token: token,
      },
      include: {
        all: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found by the token.');
    }

    // Delete associated tests first
    if (task.tests) {
      for (const test of task.tests) {
        await this.testsService.deleteTest(test.id);
      }
    }

    // Delete the task
    await task.destroy();
  }

  async testTask(
    token: string,
    answer: TaskAnswerDto,
  ): Promise<TestResultDto[]> {
    const task = await this.tasksRepository.findOne({
      where: {
        token: token,
      },
      include: {
        all: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found by the token.');
    }

    if (!task.tests) {
      throw new NotFoundException('Task does not has tests');
    }

    const test_outputs: TestResultDto[] = await Promise.all(
      task.tests.map(async (test) => {
        const response = await this.testsService.executeTest(
          answer,
          test,
          task.language,
        );

        const result: TestResultDto = {
          output: response.stdout,
          is_success: test.test_result == response.stdout,
        };

        return result;
      }),
    );

    return test_outputs;
  }

  async solveTask(
    token: string,
    answer: TaskAnswerDto,
    user: User,
  ): Promise<SolvedTask> {
    const task = await this.tasksRepository.findOne({
      where: {
        token: token,
      },
      include: {
        all: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found by the token.');
    }

    const solvedTask = this.solvedTasksRepository.create(
      {
        token: uuidv4(),
        solution: answer.answer,
        userId: user.id,
        taskId: task.id,
      } as SolvedTask,
      {
        include: {
          all: true,
        },
      },
    );

    user.experience += task.rank.value;

    if (user.experience >= user.rank.targetValue) {
      await this.usersService.promoteRank(user);
    }

    return solvedTask;
  }
}
