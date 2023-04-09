import { PickType } from '@nestjs/swagger';
import { ImageFileEntity } from 'src/common/entities/image-files.entity';

export class ImageFileUrlResponseDTO extends PickType(ImageFileEntity, [
  'url',
] as const) {}
