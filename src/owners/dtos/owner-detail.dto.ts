import { ApiProperty, PickType } from '@nestjs/swagger';
import { OwnerEntity } from '../../common/entities/owners.entity';

export class OwnerDetailDTO extends PickType(OwnerEntity, [
  'id',
  'username',
  'fullName',
  'phoneNumber',
  'businessName',
  'businessNumber',
] as const) {
  @ApiProperty({
    example: [
      {
        imageFileId: 19,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/test/won/9acdaa77-2e25-4018-bbbf-2abe492d2719.jpg',
        },
      },
      {
        imageFileId: 18,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/test/won/c49aa61f-5dac-4aaa-87e9-991413c16ed7.jpg',
        },
      },
      {
        imageFileId: 17,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/test/won/c27aacdc-6197-474e-8020-d17ef1792e32.jpg',
        },
      },
    ],
    description: '인증사진 리스트',
  })
  ownerImages: object[];
}
