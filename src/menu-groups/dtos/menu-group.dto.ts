import { PartialType } from '@nestjs/swagger';
import { MenuGroupEntity } from '../../common/entities/menu-groups.entity';

export class MenuGroupDTO extends PartialType(MenuGroupEntity) {}
