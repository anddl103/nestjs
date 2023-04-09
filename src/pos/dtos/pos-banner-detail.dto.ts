import { ApiProperty, PickType } from '@nestjs/swagger';
import { PosBannerEntity } from '../../common/entities/pos-banners.entity';

export class PosBannerDetailDTO extends PickType(PosBannerEntity, [
  'id',
  'bannerUrl',
  'href',
] as const) {}
