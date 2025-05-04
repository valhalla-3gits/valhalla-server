import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TASKS_REPOSITORY } from '../../../core/constants';
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

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY) private readonly tasksRepository: typeof Task,
    private readonly ranksService: RanksService,
    private readonly languagesService: LanguagesService,
    private readonly testsService: TestsService,
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

  async getTaskByToken(token: string): Promise<TaskDto> {
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

    const task_model: TaskDto = new TaskDto(task);

    return task_model;
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

    // Delete existing tests and create new ones
    if (task.tests) {
      for (const test of task.tests) {
        await this.testsService.deleteTest(test.id);
      }
    }

    // Create new tests
    for (const test of updateModel.tests) {
      await this.testsService.createTest(task.id, test);
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
}
