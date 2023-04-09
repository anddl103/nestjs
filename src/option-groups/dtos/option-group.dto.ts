import { PartialType } from '@nestjs/swagger';
import { OptionGroupEntity } from '../../common/entities/option-groups.entity';

export class OptionGroupDTO extends PartialType(OptionGroupEntity) {}
