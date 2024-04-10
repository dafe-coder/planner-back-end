import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'
import { Priority } from 'prisma/prisma-client'
import { Transform } from 'class-transformer'

export class TaskDto {
	@IsString()
	@IsOptional()
	name: string

	@IsBoolean()
	@IsOptional()
	isComplete?: boolean

	@IsString()
	@IsOptional()
	createdAt?: string

	@IsEnum(Priority)
	@IsOptional()
	@Transform(({ value }) => ('' + value).toLowerCase())
	priority?: Priority
}
