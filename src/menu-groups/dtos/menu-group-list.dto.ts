import { PickType } from '@nestjs/swagger';
import { MenuGroupEntity } from '../../common/entities/menu-groups.entity';

export class MenuGroupListDTO extends PickType(MenuGroupEntity, [
  'id',
  'createdAt',
  'name',
  'type',
  'menuCount',
  'position',
] as const) {}
