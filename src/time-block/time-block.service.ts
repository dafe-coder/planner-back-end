import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TimeBlockDto } from './dto/time-block.dto'

@Injectable()
export class TimeBlockService {
	constructor(private prisma: PrismaService) {}

	async getAll(userId: string) {
		return await this.prisma.timeBlock.findMany({
			where: { userId },
			orderBy: {
				order: 'asc',
			},
		})
	}

	async create(userId: string, dto: TimeBlockDto) {
		return await this.prisma.timeBlock.create({
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

	async update(id: string, dto: Partial<TimeBlockDto>, userId: string) {
		return await this.prisma.timeBlock.update({
			where: {
				id,
				userId,
			},
			data: dto,
		})
	}

	async delete(id: string) {
		const timeBlock = await this.prisma.timeBlock.findUnique({ where: { id } })
		if (!timeBlock) {
			throw new NotFoundException('Not found timeBlock with this id: ' + id)
		}
		return await this.prisma.timeBlock.delete({ where: { id } })
	}

	async updateOrder(ids: string[]) {
		return this.prisma.$transaction(
			ids.map((id, order) =>
				this.prisma.timeBlock.update({
					where: { id },
					data: {
						order,
					},
				}),
			),
		)
	}
}
