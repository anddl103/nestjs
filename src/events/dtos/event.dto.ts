import { PartialType } from '@nestjs/swagger';
import { EventEntity } from '../../common/entities/events.entity';

export class EventDTO extends PartialType(EventEntity) {}
