import { IsBoolean, IsOptional } from 'class-validator'

export class TimerSessionDto {
	@IsOptional()
	@IsBoolean()
	isCompleted?: boolean
}
