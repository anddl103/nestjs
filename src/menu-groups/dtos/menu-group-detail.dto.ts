import { PickType } from '@nestjs/swagger';
import { MenuGroupEntity } from '../../common/entities/menu-groups.entity';

export class MenuGroupDetailDTO extends PickType(MenuGroupEntity, [
  'id',
  'createdAt',
  'storeId',
  'name',
  'type',
  'position',
] as const) {}
