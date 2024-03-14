import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TaskDto } from './task.dto'

@Injectable()
export class TaskService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return await this.prisma.task.findMany({
			where: { userId },
		})
	}

	async create(userId: string, dto: TaskDto) {
		return await this.prisma.task.create({
			data: {
				...dto,
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})
	}

	async update(id: string, dto: Partial<TaskDto>, userId: string) {
		return await this.prisma.task.update({
			where: {
				id,
				userId,
			},
			data: dto,
		})
	}

	async delete(id: string) {
		const task = await this.prisma.task.findUnique({ where: { id } })
		if (!task) {
			throw new NotFoundException('Not found task with this id: ' + id)
		}
		return await this.prisma.task.delete({ where: { id } })
	}
}
