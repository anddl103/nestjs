import { PartialType } from '@nestjs/swagger';
import { OptionEntity } from '../../common/entities/options.entity';

export class OptionDTO extends PartialType(OptionEntity) {}
