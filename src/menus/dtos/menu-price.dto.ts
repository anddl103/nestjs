import { PickType } from '@nestjs/swagger';
import { MenuPriceEntity } from '../../common/entities/menu-prices.entity';

export class MenuPriceDTO extends PickType(MenuPriceEntity, [
  'id',
  'menuId',
  'name',
  'discount',
  'price',
] as const) {}
