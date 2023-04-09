import { ApiProperty } from '@nestjs/swagger';

export class ImageFileUploadRequestDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '이미지 파일',
  })
  image: any;

  @ApiProperty({
    example: 'owner',
    description: '폴더명',
  })
  folder: string;
}
