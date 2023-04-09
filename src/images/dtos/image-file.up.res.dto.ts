import { PickType } from '@nestjs/swagger';
import { ImageFileEntity } from 'src/common/entities/image-files.entity';

export class ImageFileUploadResponseDTO extends PickType(ImageFileEntity, [
  'id',
  'url',
] as const) {}
