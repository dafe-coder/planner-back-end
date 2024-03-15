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
import { TimerService } from './timer.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { TimerRoundDto } from './dto/timer-round.dto'
import { TimerSessionDto } from './dto/timer-session.dto'

@Controller('user/timer')
export class TimerController {
	constructor(private readonly timerService: TimerService) {}

	@Get('today')
	@Auth()
	async getTodaySession(@CurrentUser('id') userId: string) {
		return await this.timerService.getTodaySession(userId)
	}

	@Post()
	@HttpCode(200)
	@Auth()
	async create(@CurrentUser('id') userId: string) {
		return await this.timerService.create(userId)
	}

	@UsePipes(new ValidationPipe())
	@Put('round/:id')
	@Auth()
	async updateRound(@Param('id') idTask: string, @Body() dto: TimerRoundDto) {
		return await this.timerService.updateRound(idTask, dto)
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth()
	async update(@Param('id') idTask: string, @Body() dto: TimerSessionDto) {
		return await this.timerService.update(idTask, dto)
	}

	@Auth()
	@Delete(':id')
	async delete(@Param('id') idTask: string) {
		await this.timerService.delete(idTask)
		return true
	}
}
