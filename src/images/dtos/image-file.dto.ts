import { PartialType } from '@nestjs/swagger';
import { ImageFileEntity } from 'src/common/entities/image-files.entity';

export class ImageFileDto extends PartialType(ImageFileEntity) {}
