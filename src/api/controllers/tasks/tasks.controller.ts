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
import { SearchQuery } from '../../../core/models/queries/searchQuery';
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

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllTasks(@Req() req: AuthRequest): Promise<TaskDto[]> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const tasks: TaskDto[] = await this.tasksService.getTasks();

    if (user.favouriteTasks !== undefined) {
      tasks.forEach((task: TaskDto) => {
        if (
          user.favouriteTasks!.some((f_task) => f_task.token === task.token)
        ) {
          task.is_favourite = true;
        }
      });
    }

    return tasks;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async searchTasks(
    @Query() query: SearchQuery,
    @Req() req: AuthRequest,
  ): Promise<TaskDto[]> {
    const user = await this.usersService.findOneByToken(req.user.token);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const tasks: TaskDto[] = await this.tasksService.searchTasks(query);

    if (user.favouriteTasks !== undefined) {
      tasks.forEach((task: TaskDto) => {
        if (
          user.favouriteTasks!.some((f_task) => f_task.token === task.token)
        ) {
          task.is_favourite = true;
        }
      });
    }

    return tasks;
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
    await this.tasksService.deleteTask(token);
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

    if (user.favouriteTasks === undefined) {
      user.favouriteTasks = [];
    }

    user.favouriteTasks.push(task);
    await user.save();
  }
}
