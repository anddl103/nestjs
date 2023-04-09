import { PickType } from '@nestjs/swagger';
import { MenuEntity } from '../../common/entities/menus.entity';

export class MenuListDTO extends PickType(MenuEntity, [
  'id',
  'createdAt',
  'menuGroupId',
  'menuGroupName',
  'name',
  'menuImage',
  'basePrice',
  'requiredOption',
  'optionalOption',
  'isSignature',
  'isPopular',
  'isSoldout',
  'position',
] as const) {}
