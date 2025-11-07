import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { CreateTopicDto, UpdateTopicDto } from './dto';

@Injectable()
export class TopicsService {
	constructor(private readonly prisma: PrismaService) {}

	create(createTopicDto: CreateTopicDto) {
		return this.prisma.topic.create({ data: createTopicDto });
	}

	findAll() {
		return this.prisma.topic.findMany();
	}

	findOne(id: string) {
		return this.prisma.topic.findUnique({ where: { id } });
	}

	update(id: string, updateTopicDto: UpdateTopicDto) {
		return this.prisma.topic.update({
			where: { id },
			data: updateTopicDto
		});
	}

	remove(id: string) {
		return this.prisma.topic.delete({ where: { id } });
	}
}
