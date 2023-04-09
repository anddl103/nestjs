import { PickType } from '@nestjs/swagger';
import { MenuImageEntity } from '../../common/entities/menu-images.entity';

export class MenuImageDTO extends PickType(MenuImageEntity, [
  'id',
  'menuId',
  'imageFileId',
] as const) {}
