import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Param,
  ParseUUIDPipe,
  Query,
  Body,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from '../../../business-logic/services/tasks/tasks.service';
import {
  SearchQuery,
  SearchType,
} from '../../../core/models/queries/searchQuery';
import { SearchResult } from '../../../core/utils/SearchExtension';
import { TaskCreateDto } from '../../../core/models/dto/tasks/taskCreate.dto';
import { AuthRequest } from '../../../core/models/dto/users/userPayload.dto';
import { UsersService } from '../../../business-logic/services/users/users.service';
import { TaskDto } from '../../../core/models/dto/tasks/task.dto';
import { TaskUpdateDto } from '../../../core/models/dto/tasks/taskUpdate.dto';
import { TestDto } from '../../../core/models/dto/tests/test.dto';
import { TaskAnswerDto } from '../../../core/models/dto/tasks/taskAnswer.dto';
import { TestResultDto } from '../../../core/models/dto/tests/testResult.dto';
import { SolvedTaskDto } from '../../../core/models/dto/tasks/solvedTask.dto';
import { Task } from '../../../core/models/entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Search for tasks with optional filtering, fuzzy search, sorting, and pagination
   *
   * @param query SearchQuery object containing:
   *   - search_string: String to search for in task names (fuzzy search)
   *   - rank_filter: ID of the rank to filter by
   *   - language_filter: ID of the language to filter by
   *   - search_type: Type of search ('all', 'favorites', 'solved')
   *   - sort_by: Field to sort by ('createdAt' or 'name')
   *   - sort_direction: Direction to sort ('asc' or 'desc')
   *   - page: Page number (starts at 1)
   *   - limit: Number of items per page
   * @param req Request object containing user information
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async searchTasks(
    @Query() query: SearchQuery,
    @Req() req: AuthRequest,
  ): Promise<SearchResult<TaskDto>> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Handle different search types
    let result: SearchResult<TaskDto>;

    if (query.search_type === SearchType.FAVORITES) {
      // Get all tasks and filter for favorites
      const searchResult = await this.tasksService.searchTasks(query);

      // Filter to only include favorite tasks
      if (user.favouriteTasks && user.favouriteTasks.length > 0) {
        const favoriteTokens = user.favouriteTasks.map((task) => task.token);
        searchResult.items = searchResult.items.filter((task) =>
          favoriteTokens.includes(task.token),
        );
      } else {
        searchResult.items = [];
      }

      result = searchResult;
    } else if (query.search_type === SearchType.SOLVED) {
      // Get all tasks and filter for solved
      const searchResult = await this.tasksService.searchTasks(query);

      // Filter to only include solved tasks
      if (user.solvedTasks && user.solvedTasks.length > 0) {
        const solvedTokens = user.solvedTasks.map((task) => task.token);
        searchResult.items = searchResult.items.filter((task) =>
          solvedTokens.includes(task.token),
        );
      } else {
        searchResult.items = [];
      }

      result = searchResult;
    } else {
      // Default search type (ALL)
      result = await this.tasksService.searchTasks(query);
    }

    // Mark favorite tasks
    if (user.favouriteTasks !== undefined) {
      result.items.forEach((task: TaskDto) => {
        if (
          user.favouriteTasks!.some((f_task) => f_task.token === task.token)
        ) {
          task.is_favourite = true;
        }
      });
    }

    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addTask(
    @Body() createModel: TaskCreateDto,
    @Req() req: AuthRequest,
  ): Promise<TaskDto> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const task = await this.tasksService.createTask(createModel, user.id);

    return task;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':token')
  async getTask(
    @Param('token', ParseUUIDPipe) token: string,
    @Req() req: AuthRequest,
  ): Promise<TaskDto> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const task: Task = await this.tasksService.getTaskByToken(token);

    const task_model = new TaskDto(task);

    if (user.favouriteTasks !== undefined) {
      if (
        user.favouriteTasks.some((f_task) => f_task.token === task_model.token)
      ) {
        task_model.is_favourite = true;
      }
    }

    return task_model;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':token/tests')
  async getTests(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<TestDto[]> {
    const task: Task = await this.tasksService.getTaskByToken(token);

    const task_model = new TaskDto(task);

    return task_model.tests;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':token')
  async updateTask(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() updateModel: TaskUpdateDto,
    @Req() req: AuthRequest,
  ): Promise<TaskDto> {
    // Verify user exists
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Update the task
    const updatedTask = await this.tasksService.updateTask(token, updateModel);

    if (user.favouriteTasks !== undefined) {
      if (
        user.favouriteTasks.some((f_task) => f_task.token === updatedTask.token)
      ) {
        updatedTask.is_favourite = true;
      }
    }

    return updatedTask;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':token')
  async deleteTask(
    @Param('token', ParseUUIDPipe) token: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    // Verify user exists
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    // Delete the task
    await this.tasksService.deleteTask(token, user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':token')
  async testTaskSolution(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() answer: TaskAnswerDto,
    @Req() req: AuthRequest,
  ): Promise<TestResultDto[]> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const test_results: TestResultDto[] = await this.tasksService.testTask(
      token,
      answer,
    );

    return test_results;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':token/submit')
  async submitTaskSolution(
    @Param('token', ParseUUIDPipe) token: string,
    @Body() answer: TaskAnswerDto,
    @Req() req: AuthRequest,
  ): Promise<SolvedTaskDto> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const test_results: TestResultDto[] = await this.tasksService.testTask(
      token,
      answer,
    );

    for (const test of test_results) {
      if (!test.is_success) {
        throw new BadRequestException('Task is not solved');
      }
    }

    const solvedTask = await this.tasksService.solveTask(token, answer, user);

    const solvedTaskDto = new SolvedTaskDto(solvedTask);

    return solvedTaskDto;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':token/favourite')
  async addTaskToFavourites(
    @Param('token', ParseUUIDPipe) token: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const task = await this.tasksService.getTaskByToken(token);

    // Check if the task is already in the favourite tasks list
    const isFavourite = user.favouriteTasks?.some(
      (f_task) => f_task.token === task.token,
    );

    // Toggle the favourite status of the task
    if (isFavourite) {
      user.favouriteTasks = user.favouriteTasks?.filter(
        (f_task) => f_task.token !== task.token,
      );
    } else {
      user.favouriteTasks?.push(task);
    }

    await user.save();
  }
}
