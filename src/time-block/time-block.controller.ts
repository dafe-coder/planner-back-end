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
import { TimeBlockService } from './time-block.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { TimeBlockDto } from './dto/time-block.dto'
import { UpdateOrderDto } from './dto/update-order.dto'

@Controller('user/time-blocks')
export class TimeBlockController {
	constructor(private readonly timeBlockService: TimeBlockService) {}

	@Get()
	@Auth()
	async getAll(@CurrentUser('id') userId: string) {
		return await this.timeBlockService.getAll(userId)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@HttpCode(200)
	@Auth()
	async create(@CurrentUser('id') userId: string, @Body() dto: TimeBlockDto) {
		return await this.timeBlockService.create(userId, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth()
	async update(
		@CurrentUser('id') userId: string,
		@Param('id') idTask: string,
		@Body() dto: TimeBlockDto,
	) {
		return await this.timeBlockService.update(idTask, dto, userId)
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') idTask: string) {
		await this.timeBlockService.delete(idTask)
		return true
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('update-order')
	@Auth()
	async updateOrder(@Body() dto: UpdateOrderDto) {
		return await this.timeBlockService.updateOrder(dto.ids)
	}
}
