import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { TaskService } from './task.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { TaskDto } from './task.dto'

@Controller('user/tasks')
export class TaskController {
	constructor(private readonly userService: TaskService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return await this.userService.getAll(userId)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth()
	async create(@CurrentUser('id') userId: string, @Body() dto: TaskDto) {
		return await this.userService.create(userId, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@HttpCode(200)
	@Auth()
	async update(
		@CurrentUser('id') userId: string,
		@Param('id') idTask: string,
		@Body() dto: TaskDto,
	) {
		return await this.userService.update(idTask, dto, userId)
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') idTask: string) {
		await this.userService.delete(idTask)
		return true
	}
}
