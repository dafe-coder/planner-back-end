import { Body, Controller, Get, HttpCode, Put } from '@nestjs/common'
import { UserService } from './user.service'
import { Auth } from 'src/auth/decorators/auth.decorators'
import { CurrentUser } from 'src/auth/decorators/user.decorators'
import { UserDto } from './user.dto'

@Controller('user/profile')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@Auth()
	async getProfile(@CurrentUser('id') userId: string) {
		return this.userService.getProfile(userId)
	}

	@Put()
	@Auth()
	@HttpCode(200)
	async updateProfile(@CurrentUser('id') userId: string, @Body() dto: UserDto) {
		return this.userService.update(userId, dto)
	}
}
