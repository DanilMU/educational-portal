import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators';
import { JwtAuthGuard, RolesGuard } from 'src/common/guards';

import { CreateTopicDto, UpdateTopicDto } from './dto';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
	constructor(private readonly topicsService: TopicsService) {}

	@Post()
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	create(@Body() createTopicDto: CreateTopicDto) {
		return this.topicsService.create(createTopicDto);
	}

	@Get()
	findAll() {
		return this.topicsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.topicsService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	update(@Param('id') id: string, @Body() updateTopicDto: UpdateTopicDto) {
		return this.topicsService.update(id, updateTopicDto);
	}

	@Delete(':id')
	@UseGuards(JwtAuthGuard, RolesGuard)
	@Roles(Role.ADMIN, Role.MODERATOR)
	remove(@Param('id') id: string) {
		return this.topicsService.remove(id);
	}
}
