import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  UseGuards,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
export class TasksController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllTasks(): Promise<void> {
    // TODO: Implement getting all tasks with filtering
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async addTask(): Promise<void> {
    // TODO: Implement adding a new task
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':token')
  async getTask(@Param('token', ParseUUIDPipe) token: string): Promise<void> {
    // TODO: Implement getting a task
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':token')
  async updateTask(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<void> {
    // TODO: Implement updating a task
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':token')
  async deleteTask(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<void> {
    // TODO: Implement deleting a task
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':token')
  async testTaskSolution(
    @Param('token', ParseUUIDPipe) token: string,
  ): Promise<void> {
    // TODO: Implement testing task solution
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
