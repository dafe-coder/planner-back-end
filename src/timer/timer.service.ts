import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { TimerRoundDto } from './dto/timer-round.dto'

@Injectable()
export class TimerService {
	constructor(private prisma: PrismaService) {}

	async getTodaySession(userId: string) {
		const today = new Date().toISOString().split('T')[0]

		return await this.prisma.pomodoroSession.findFirst({
			where: {
				createdAt: {
					gte: new Date(today),
				},
				userId,
			},
			include: {
				rounds: {
					orderBy: {
						id: 'desc',
					},
				},
			},
		})
	}

	async create(userId: string) {
		const todaySession = await this.getTodaySession(userId)

		if (todaySession) return todaySession

		const user = await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
			select: { intervalsCount: true },
		})

		if (!user) throw new NotFoundException('User not found')

		return await this.prisma.pomodoroSession.create({
			data: {
				rounds: {
					createMany: {
						data: Array.from({ length: user.intervalsCount }, () => ({
							totalSeconds: 0,
						})),
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
			include: {
				rounds: true,
			},
		})
	}

	async updateRound(id: string, dto: Partial<TimerRoundDto>) {
		return await this.prisma.pomodoroRound.update({
			where: {
				id,
			},
			data: dto,
		})
	}

	async update(id: string, dto: Partial<TimerRoundDto>) {
		return await this.prisma.pomodoroSession.update({
			where: {
				id,
			},
			data: dto,
		})
	}

	async delete(id: string) {
		const pomodoroSession = await this.prisma.pomodoroSession.findUnique({
			where: { id },
		})
		if (!pomodoroSession) {
			throw new NotFoundException(
				'Not found pomodoroSession with this id: ' + id,
			)
		}
		return await this.prisma.pomodoroSession.delete({ where: { id } })
	}
}
