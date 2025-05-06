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

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllTasks(): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.tasksService.getTasks();
    return tasks;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async searchTasks(@Query() query: SearchQuery): Promise<TaskDto[]> {
    const tasks: TaskDto[] = await this.tasksService.searchTasks(query);
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
  ): Promise<TaskDto> {
    const task: TaskDto = await this.tasksService.getTaskByToken(token);

    return task;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':token/tests')
  async getTests(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<TestDto[]> {
    const task: TaskDto = await this.tasksService.getTaskByToken(token);

    return task.tests;
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
  ): Promise<void> {
    // TODO: Implement submitting task solution
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':token/favourite')
  async addTaskToFavourites(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<void> {
    // TODO: Implement adding task to favourites
  }
}
