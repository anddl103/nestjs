import { ApiProperty, PickType } from '@nestjs/swagger';
import { MenuEntity } from '../../common/entities/menus.entity';

export class MenuDetailDTO extends PickType(MenuEntity, [
  'id',
  'createdAt',
  'storeId',
  'menuGroupId',
  'name',
  'description',
  'isSignature',
  'isPopular',
  'isSoldout',
  'isDonation',
] as const) {
  @ApiProperty({
    example: [
      {
        imageFileId: 1,
        imageFile: {
          url: 'https://d1jwjxg29cufk5.cloudfront.net/stores/pasta-salad-1967501_640.jpg',
        },
      },
    ],
    description: '메뉴사진 리스트( 0 ~ 1개 확장성을 고려해 리스트로 )',
    required: false,
  })
  menuImages: object[];

  @ApiProperty({
    example: [
      {
        id: 1,
        name: '1-2인분',
        discount: 0,
        price: 16900,
      },
      {
        id: 2,
        name: '3-4인분',
        discount: 0,
        price: 26900,
      },
    ],
    description: '메뉴가격 리스트( 1 ~ 10개 )',
    required: true,
  })
  menuPrices: object[];

  @ApiProperty({
    example: [1, 2],
    description: '필수옵션 아이디 리스트( 0 ~ 20개 )',
    required: false,
  })
  requiredOptionIds: number[];

  @ApiProperty({
    example: [1, 2],
    description: '선택옵션 아이디 리스트( 0 ~ 20개 )',
    required: false,
  })
  optionalOptionIds: number[];
}
